/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { TRPCError } from "@trpc/server";
import { z } from "zod";
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
if (!BUCKET) throw new Error("S3 bucket missing for gaming banners");

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
    .input(z.object({
      styleId: z.string(),
      channelName: z.string(),
      tagline: z.string().optional(),
      logoUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {

      const { styleId, channelName, tagline = "", logoUrl = "" } = input;

      // 1. Load style
      const style = TWITCH_BANNER_STYLES.find(s => s.id === styleId);
      if (!style) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid style" });

      const W = style.styleRules.canvasWidth;
      const H = style.styleRules.canvasHeight;

      // 2. Deduct credits
      const creditsNeeded = style.creditCost ?? 2;
      const { count } = await ctx.prisma.user.updateMany({
        where: { id: ctx.session.user.id, gamingCredits: { gte: creditsNeeded } },
        data: { gamingCredits: { decrement: creditsNeeded } },
      });
      if (count <= 0)
        throw new TRPCError({ code: "BAD_REQUEST", message: "Not enough credits" });

      // 3. Load background
      const bgPath = path.join(process.cwd(), "public", style.backgroundSrc.replace(/^\//, ""));
      if (!fs.existsSync(bgPath))
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Background image missing" });

      let bgBuffer = fs.readFileSync(bgPath);

      // 4. Optional logo composite
      if (logoUrl && style.styleRules.photo) {
        try {
          const resp = await fetch(logoUrl);
          const buf = Buffer.from(await resp.arrayBuffer());
          const { x, y, width, height } = style.styleRules.photo;

          const resized = await sharp(buf)
            .resize(width, height)
            .png()
            .toBuffer();

          bgBuffer = await sharp(bgBuffer)
            .composite([{ input: resized, left: x, top: y }])
            .png()
            .toBuffer();
        } catch (err) {
          console.error("Logo composite failed:", err);
        }
      }

      // Resize final background
      const resizedBackground = await sharp(bgBuffer)
        .resize(W, H, { fit: "cover" })
        .png()
        .toBuffer();

      const backgroundDataUrl =
        `data:image/png;base64,${resizedBackground.toString("base64")}`;

      // 5. Prepare fonts
      const fonts = style.styleRules.fonts;

      const fontFaces = Object.values(fonts)
        .map((font) => {
          const fp = path.join(process.cwd(), "public", "fonts", font.file);
          const base64 = fs.readFileSync(fp).toString("base64");
          return `
            @font-face {
              font-family: '${escapeXml(font.family)}';
              src: url(data:font/ttf;base64,${base64}) format('truetype');
            }
          `;
        })
        .join("\n");

      // 6. Text elements
      const elements = style.styleRules.elements;
      const channelRule = elements.channelName;
      const taglineRule = elements.tagline;

      if (!channelRule) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Style is missing channelName element.",
        });
      }


      const channelFont = fonts[channelRule.fontFamily];
      if (!channelFont) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Style is missing channelName font.",
        });
      }
      const taglineFont = taglineRule ? fonts[taglineRule.fontFamily] : null;
      

      const svg = `
      <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
        <style>${fontFaces}</style>

        <image href="${backgroundDataUrl}" x="0" y="0" width="${W}" height="${H}" />

        <text
          x="${channelRule.x}"
          y="${channelRule.y}"
          font-family="${escapeXml(channelFont.family)}"
          font-size="${channelRule.fontSize}"
          fill="${channelRule.color}"
          text-anchor="${channelRule.textAnchor ?? "start"}"
          font-weight="${channelRule.fontWeight ?? "bold"}"
        >
          ${escapeXml(channelName.toUpperCase())}
        </text>

        ${
          tagline && taglineRule
            ? `
        <text
          x="${taglineRule.x}"
          y="${taglineRule.y}"
          font-family="${escapeXml(taglineFont!.family)}"
          font-size="${taglineRule.fontSize}"
          fill="${taglineRule.color}"
          text-anchor="${taglineRule.textAnchor ?? "start"}"
          font-weight="${taglineRule.fontWeight ?? "normal"}"
        >
          ${escapeXml(tagline.toUpperCase())}
        </text>
        `
            : ""
        }
      </svg>
      `;

      // 7. Render SVG with puppeteer-core + chromium
      let finalBuffer: Buffer;
      try {
        const browser = await puppeteer.launch({
          args: chromium.args,
          headless: true,
          defaultViewport: { width: W, height: H },
          executablePath: await chromium.executablePath(),   // 🟢 SAME AS WEDDING PRODUCTION BRANCH
        });

        const page = await browser.newPage();
        await page.setContent(svg, { waitUntil: "domcontentloaded" });

        const screenshot = await page.screenshot({ type: "png" });
        await browser.close();

        finalBuffer = Buffer.from(screenshot);
      } catch (err) {
        console.error("❌ Puppeteer error:", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Render failed" });
      }

      // 8. Upload to S3
      const icon = await ctx.prisma.icon.create({
        data: { prompt: `Twitch:${styleId}:${channelName}`, userId: ctx.session.user.id },
      });

      await s3
        .putObject({
          Bucket: BUCKET,
          Key: icon.id,
          Body: finalBuffer,
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
