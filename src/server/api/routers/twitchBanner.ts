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
import { TWITCH_BANNER_STYLES } from "~/data/twitchBannerStyles";
import { env } from "~/env.mjs";

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
  region: env.NEXT_PUBLIC_AWS_REGION_GAMING,
});

const BUCKET = env.NEXT_PUBLIC_S3_BUCKET_NAME_GAMING;

function escapeXml(str: string) {
  return str.replace(/[<>&"']/g, (c) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
    "'": "&#39;",
  }[c as never] || c));
}

export const twitchBannerRouter = createTRPCRouter({
  generate: protectedProcedure
    .input(
      z.object({
        styleId: z.string(),
        channelName: z.string(),
        tagline: z.string().optional(),
        logoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { styleId, channelName, tagline = "", logoUrl = "" } = input;

      const style = TWITCH_BANNER_STYLES.find((s) => s.id === styleId);
      if (!style) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid style" });

      const W = style.styleRules.canvasWidth;
      const H = style.styleRules.canvasHeight;

      // deduct credits
      const creditsNeeded = style.creditCost ?? 2;
      const { count } = await ctx.prisma.user.updateMany({
        where: { id: ctx.session.user.id, gamingCredits: { gte: creditsNeeded } },
        data: { gamingCredits: { decrement: creditsNeeded } },
      });
      if (count <= 0) throw new TRPCError({ code: "BAD_REQUEST", message: "Not enough credits" });

      // load background
      const bgPath = path.join(process.cwd(), "public", style.backgroundSrc.replace(/^\//, ""));
      if (!fs.existsSync(bgPath)) throw new Error("Missing background");

      let bgBuffer = fs.readFileSync(bgPath);

      // composite uploaded logo
      if (style.styleRules.photo && logoUrl) {
        try {
          const resp = await fetch(logoUrl);
          const buf = Buffer.from(await resp.arrayBuffer());
          const { x, y, width, height } = style.styleRules.photo;

          const resized = await sharp(buf).resize(width, height).png().toBuffer();

          bgBuffer = await sharp(bgBuffer)
            .composite([{ input: resized, left: x, top: y }])
            .png()
            .toBuffer();
        } catch (e) {
          console.error("Logo composite failed:", e);
        }
      }

      const backgroundDataUrl =
        `data:image/png;base64,${bgBuffer.toString("base64")}`;

      // fonts
      const fontFaces = Object.entries(style.styleRules.fonts)
        .map(([_, font]) => {
          const fp = path.join(process.cwd(), "public", "fonts", font.file);
          if (!fs.existsSync(fp)) return "";

          const b64 = fs.readFileSync(fp).toString("base64");
          return `@font-face {
              font-family: '${escapeXml(font.family)}';
              src: url(data:font/ttf;base64,${b64}) format('truetype');
          }`;
        })
        .join("\n");

      const el = style.styleRules.elements;

      const channelRule = el.channelName;
      const taglineRule = el.tagline;

      if (!channelRule) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid style configuration" });

      const svg = `
      <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
        <style>${fontFaces}</style>
        <image href="${backgroundDataUrl}" x="0" y="0" width="${W}" height="${H}" />

        <text
          x="${channelRule.x}"
          y="${channelRule.y}"
          font-family="${escapeXml(style.styleRules.fonts[channelRule.fontFamily]?.family ?? 'sans-serif')}"
          font-size="${channelRule.fontSize}"
          fill="${channelRule.color}"
          text-anchor="${channelRule.textAnchor ?? "start"}"
          font-weight="${channelRule.fontWeight ?? "bold"}"
        >
        ${escapeXml(channelName.toUpperCase())}
        </text>

        ${taglineRule ? `
        <text
          x="${taglineRule.x}"
          y="${taglineRule.y}"
          font-family="${escapeXml(style.styleRules.fonts[taglineRule.fontFamily]?.family ?? 'sans-serif')}"
          font-size="${taglineRule.fontSize}"
          fill="${taglineRule.color}"
          text-anchor="${taglineRule.textAnchor ?? "start"}"
          font-weight="${taglineRule.fontWeight ?? "normal"}"
        >
        ${escapeXml(tagline.toUpperCase())}
        </text>` : ""}
      </svg>
      `;

      // puppeteer render
      let finalImageBuffer: Buffer;
      try {
        const browser = await puppeteer.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath(),
          headless: true,
        });

        const page = await browser.newPage();
        await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
        await page.setContent(svg, { waitUntil: "domcontentloaded" });

        const shot = await page.screenshot({ type: "png" });
        await browser.close();

        finalImageBuffer = Buffer.from(shot);
      } catch (err) {
        console.error("PUPPETEER FAIL:", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Render failed" });
      }

      const icon = await ctx.prisma.icon.create({
        data: {
          prompt: `TwitchBanner:${styleId}:${channelName}`,
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
