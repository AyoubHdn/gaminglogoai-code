// ~/server/api/routers/twitchStreamScreen.ts
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
import { TWITCH_STREAM_SCREEN_STYLES } from "~/data/twitchStreamScreenStyles";
import { env } from "~/env.mjs";

/* ---------------- S3 ---------------- */
const s3 = new AWS.S3({
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
  region: env.NEXT_PUBLIC_AWS_REGION_GAMING,
});

const BUCKET = env.NEXT_PUBLIC_S3_BUCKET_NAME_GAMING;
if (!BUCKET) throw new Error("Missing S3 bucket");

/* ---------------- Utils ---------------- */
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

/* ---------------- Router ---------------- */
export const twitchStreamScreenRouter = createTRPCRouter({
  generate: protectedProcedure
    .input(
      z.object({
        styleId: z.string(),
        title: z.string(),
        subtitle: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }): Promise<{ imageUrl: string }[]> => {
      const { styleId, title, subtitle = "" } = input;

      const style = TWITCH_STREAM_SCREEN_STYLES.find((s) => s.id === styleId);
      if (!style) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid screen style" });
      }

      const { canvasWidth: W, canvasHeight: H } = style.styleRules;

      /* -------- Credits -------- */
      const { count } = await ctx.prisma.user.updateMany({
        where: { id: ctx.session.user.id, gamingCredits: { gte: style.creditCost } },
        data: { gamingCredits: { decrement: style.creditCost } },
      });

      if (count <= 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Not enough credits" });
      }

      /* -------- Background -------- */
      let backgroundBuffer: Buffer;
      if (style.backgroundSrc.startsWith("http")) {
        const r = await fetch(style.backgroundSrc);
        backgroundBuffer = Buffer.from(await r.arrayBuffer());
      } else {
        backgroundBuffer = fs.readFileSync(
          path.join(process.cwd(), "public", style.backgroundSrc.replace(/^\//, ""))
        );
      }

      backgroundBuffer = await sharp(backgroundBuffer)
        .resize(W, H, { fit: "cover" })
        .png()
        .toBuffer();

      const bgDataUrl = `data:image/png;base64,${backgroundBuffer.toString("base64")}`;

      /* -------- Fonts -------- */
      const fonts = style.styleRules.fonts;
      const fontFaces = Object.values(fonts)
        .map((f) => {
          const fp = path.join(process.cwd(), "public/fonts", f.file);
          if (!fs.existsSync(fp)) return "";
          const base = fs.readFileSync(fp).toString("base64");
          return `@font-face { font-family:'${f.family}'; src:url(data:font/ttf;base64,${base}); }`;
        })
        .join("\n");

      const { title: tRule, subtitle: sRule } = style.styleRules.elements;

      /* -------- SVG -------- */
      const svg = `
        <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
          <style>${fontFaces}</style>
          <image href="${bgDataUrl}" x="0" y="0" width="${W}" height="${H}" />

          <text
            x="${tRule.x}"
            y="${tRule.y}"
            font-family="${fonts[tRule.fontFamily]?.family ?? 'Arial'}"
            font-size="${tRule.fontSize}"
            fill="${tRule.color}"
            text-anchor="${tRule.textAnchor}"
            font-weight="${tRule.fontWeight ?? "bold"}"
          >
            ${escapeXml(title.toUpperCase())}
          </text>

          ${
            sRule && subtitle
              ? `<text
                   x="${sRule.x}"
                     y="${sRule.y}"
                     font-family="${fonts[sRule.fontFamily]?.family ?? 'Arial'}"
                     font-size="${sRule.fontSize}"
                     fill="${sRule.color}"
                     text-anchor="${sRule.textAnchor}"
                 >${escapeXml(subtitle)}</text>`
              : ""
          }
        </svg>
      `;

      /* -------- Render -------- */
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
      await page.setContent(svg);
      const buffer = Buffer.from(await page.screenshot({ omitBackground: true }));
      await browser.close();

      /* -------- Save -------- */
      const icon = await ctx.prisma.icon.create({
        data: {
          prompt: `StreamScreen:${styleId}:${title}`,
          userId: ctx.session.user.id,
        },
      });

      await s3.putObject({
        Bucket: BUCKET,
        Key: icon.id,
        Body: buffer,
        ContentType: "image/png",
      }).promise();

      return [{
        imageUrl: `https://${BUCKET}.s3.${env.NEXT_PUBLIC_AWS_REGION_GAMING}.amazonaws.com/${icon.id}`,
      }];
    }),
});
