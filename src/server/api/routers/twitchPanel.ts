// src/server/api/routers/twitchPanel.ts
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import AWS from "aws-sdk";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TWITCH_PANEL_STYLES } from "~/data/twitchPanelStyles";
import { env } from "~/env.mjs";

/* ------------------------------------------------------------------ */
/* S3 */
/* ------------------------------------------------------------------ */
const s3 = new AWS.S3({
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
  region: env.NEXT_PUBLIC_AWS_REGION_GAMING,
});

const BUCKET = env.NEXT_PUBLIC_S3_BUCKET_NAME_GAMING;
if (!BUCKET) throw new Error("Missing S3 bucket");

/* ------------------------------------------------------------------ */
/* Utils */
/* ------------------------------------------------------------------ */
function escapeXml(str: string) {
  return str.replace(/[<>&"']/g, (c) =>
    ({
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      '"': "&quot;",
      "'": "&#39;",
    }[c as never] || c)
  );
}

/* ------------------------------------------------------------------ */
/* Router */
/* ------------------------------------------------------------------ */
export const twitchPanelRouter = createTRPCRouter({
  generate: protectedProcedure
    .input(
      z.object({
        styleId: z.string(),
        title: z.string(),
      })
    )
    .mutation(async ({ input, ctx }): Promise<{ imageUrl: string }[]> => {
      const { styleId, title } = input;

      /* 1. Style */
      const style = TWITCH_PANEL_STYLES.find((s) => s.id === styleId);
      if (!style) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid panel style" });
      }

      const W = style.styleRules.canvasWidth;
      const H = style.styleRules.canvasHeight;

      /* 2. Credits */
      const creditsNeeded = style.creditCost ?? 1;
      const { count } = await ctx.prisma.user.updateMany({
        where: {
          id: ctx.session.user.id,
          gamingCredits: { gte: creditsNeeded },
        },
        data: {
          gamingCredits: { decrement: creditsNeeded },
        },
      });

      if (count <= 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Not enough credits" });
      }

      /* 3. Background */
      let backgroundBuffer: Buffer;

      if (style.backgroundSrc.startsWith("http")) {
        const resp = await fetch(style.backgroundSrc);
        if (!resp.ok) throw new Error("Cannot load background");
        backgroundBuffer = Buffer.from(await resp.arrayBuffer());
      } else {
        const bgPath = path.join(
          process.cwd(),
          "public",
          style.backgroundSrc.replace(/^\//, "")
        );
        backgroundBuffer = fs.readFileSync(bgPath);
      }

      backgroundBuffer = await sharp(backgroundBuffer)
        .resize(W, H, { fit: "cover" })
        .png()
        .toBuffer();

      const bgDataUrl = `data:image/png;base64,${backgroundBuffer.toString("base64")}`;

      /* 4. Fonts */
      const fonts = style.styleRules.fonts || {};
      const fontFaces = Object.values(fonts)
        .map((font) => {
          const fp = path.join(process.cwd(), "public", "fonts", font.file);
          if (!fs.existsSync(fp)) return "";
          const base = fs.readFileSync(fp).toString("base64");
          return `
            @font-face {
              font-family: '${font.family}';
              src: url(data:font/ttf;base64,${base}) format('truetype');
            }
          `;
        })
        .join("\n");

      const titleRule = style.styleRules.elements.title;
      const titleFont = fonts[titleRule.fontFamily] ?? { family: "sans-serif" };

      /* 5. SVG */
      const svg = `
        <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
          <style>
            ${fontFaces}
            text { dominant-baseline: middle; }
          </style>

          <image href="${bgDataUrl}" x="0" y="0" width="${W}" height="${H}" />

          <text
            x="${titleRule.x}"
            y="${titleRule.y}"
            font-family="${escapeXml(titleFont.family)}"
            font-size="${titleRule.fontSize}"
            fill="${titleRule.color}"
            text-anchor="${titleRule.textAnchor ?? "start"}"
            font-weight="${titleRule.fontWeight ?? "bold"}"
            letter-spacing="${titleRule.letterSpacing ?? 0}"
          >
            ${escapeXml(title.toUpperCase())}
          </text>
        </svg>
      `;

      /* 6. Render */
      let finalImageBuffer: Buffer;

      try {
        const browser = await puppeteer.launch({
          args: chromium.args,
          executablePath:
            process.env.NODE_ENV === "development"
              ? (await import("puppeteer")).executablePath()
              : await chromium.executablePath(),
          headless: true,
        });

        const page = await browser.newPage();
        await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
        await page.setContent(svg, { waitUntil: "domcontentloaded" });

        const screenshot = await page.screenshot({ omitBackground: true });
        await browser.close();

        finalImageBuffer = Buffer.from(screenshot);
      } catch (err) {
        console.error("PUPPETEER ERROR:", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Render failed" });
      }

      /* 7. Save */
      const icon = await ctx.prisma.icon.create({
        data: {
          prompt: `TwitchPanel:${styleId}:${title}`,
          userId: ctx.session.user.id,
        },
      });

      await s3
        .putObject({
          Bucket: BUCKET,
          Key: icon.id,
          Body: finalImageBuffer,
          ContentType: "image/png",
        })
        .promise();

      return [
        {
          imageUrl: `https://${BUCKET}.s3.${env.NEXT_PUBLIC_AWS_REGION_GAMING}.amazonaws.com/${icon.id}`,
        },
      ];
    }),
});
