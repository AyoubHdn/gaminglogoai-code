/* ~/server/api/routers/twitchBanner.ts */
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
if (!BUCKET) throw new Error("Missing S3 bucket");

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
    .mutation(async ({ input, ctx }): Promise<{ imageUrl: string }[]> => {
      const { styleId, channelName, tagline = "", logoUrl = "" } = input;

      // 1. Find style
      const style = TWITCH_BANNER_STYLES.find((s) => s.id === styleId);
      if (!style) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid banner style" });

      const W = style.styleRules.canvasWidth;
      const H = style.styleRules.canvasHeight;

      // 2. Deduct credits
      const creditsNeeded = style.creditCost ?? 2;
      const { count } = await ctx.prisma.user.updateMany({
        where: { id: ctx.session.user.id, gamingCredits: { gte: creditsNeeded } },
        data: { gamingCredits: { decrement: creditsNeeded } },
      });
      if (count <= 0) throw new TRPCError({ code: "BAD_REQUEST", message: "Not enough credits" });

      // 3. Load background (raw)
      let backgroundBuffer: Buffer;
      if (style.backgroundSrc.startsWith("http")) {
        const resp = await fetch(style.backgroundSrc);
        if (!resp.ok) throw new Error("Cannot load background from S3");
        backgroundBuffer = Buffer.from(await resp.arrayBuffer());
      } else {
        const bgPath = path.join(process.cwd(), "public", style.backgroundSrc.replace(/^\//, ""));
        backgroundBuffer = fs.readFileSync(bgPath);
      }

      // Make sure background is exactly W x H (no extra pixels).
      // Use 'cover' so it fills exact size, but if your backgrounds are already exact this is safe.
      backgroundBuffer = await sharp(backgroundBuffer)
        .resize(W, H, { fit: "cover" })
        .png()
        .toBuffer();

      // 4. If supportsPhoto and a logoUrl provided, combine USER then BACKGROUND (background must contain transparency)
      // We'll produce `finalCanvasBuffer` which already contains user photo behind the background.
      let finalCanvasBuffer: Buffer = backgroundBuffer;

      if (style.supportsPhoto && logoUrl && style.styleRules.photo) {
        try {
          const { x, y, width, height } = style.styleRules.photo;

          // fetch user image
          const resp = await fetch(logoUrl);
          if (!resp.ok) throw new Error("Cannot fetch user photo");
          const userBuf = Buffer.from(await resp.arrayBuffer());

          // resize user image to the exact container (cover)
          const resizedUser = await sharp(userBuf)
            .resize(width, height, { fit: "cover" })
            .png()
            .toBuffer();

          // create an empty transparent canvas of the final canvas size,
          // place the user image at the required x,y, then composite the background on top
          finalCanvasBuffer = await sharp({
            create: {
              width: W,
              height: H,
              channels: 4,
              background: { r: 0, g: 0, b: 0, alpha: 0 },
            },
          })
            .composite([
              // 1) user photo at its slot
              { input: resizedUser, left: x, top: y },

              // 2) background PNG overlay (which contains transparency/window)
              { input: backgroundBuffer, left: 0, top: 0 },
            ])
            .png()
            .toBuffer();
        } catch (err) {
          console.error("PHOTO COMPOSITE ERROR:", err);
          // fallback to background-only if composite fails
          finalCanvasBuffer = backgroundBuffer;
        }
      } else {
        // no photo - keep background as final canvas
        finalCanvasBuffer = backgroundBuffer;
      }

      // 5. Build data URL used inside SVG (base64)
      const backgroundDataUrl = `data:image/png;base64,${finalCanvasBuffer.toString("base64")}`;

      // 6. Embed fonts (same pattern as wedding)
      const fonts = style.styleRules.fonts || {};
      const fontFaces = Object.values(fonts)
        .map((font) => {
          const fp = path.join(process.cwd(), "public", "fonts", font.file);
          if (!fs.existsSync(fp)) return "";
          const base = fs.readFileSync(fp).toString("base64");
          return `@font-face { font-family: '${font.family}'; src: url(data:font/ttf;base64,${base}) format('truetype'); }`;
        })
        .join("\n");

      // 7. Prepare text elements
      const elements = style.styleRules.elements;
      const channelRule = elements.channelName;
      const taglineRule = elements.tagline;
      if (!channelRule) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "channelName element missing in style" });
      }
      const channelFont = fonts[channelRule.fontFamily] ?? { family: "sans-serif" };
      const taglineFont = taglineRule ? fonts[taglineRule.fontFamily] : null;
      const hasTagline = tagline.trim().length > 0 && !!taglineRule;

      // 8. Create final SVG (background image + texts)
      const svg = `
        <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
          <style>
            ${fontFaces}
            text { dominant-baseline: middle; }
          </style>

          <image href="${backgroundDataUrl}" x="0" y="0" width="${W}" height="${H}" />

          <text
            x="${channelRule.x}"
            y="${channelRule.y}"
            font-family="${escapeXml(channelFont.family)}"
            font-size="${channelRule.fontSize}"
            fill="${channelRule.color}"
            letter-spacing="${channelRule.letterSpacing ?? 0}"
            text-anchor="${channelRule.textAnchor ?? "start"}"
            font-weight="${channelRule.fontWeight ?? "bold"}"
          >
            ${escapeXml(channelName.toUpperCase())}
          </text>

          ${
            hasTagline
              ? `<text
                   x="${taglineRule.x}"
                   y="${taglineRule.y}"
                   font-family="${escapeXml(taglineFont?.family ?? "sans-serif")}"
                   font-size="${taglineRule.fontSize}"
                   fill="${taglineRule.color}"
                   letter-spacing="${taglineRule.letterSpacing ?? 0}"
                   text-anchor="${taglineRule.textAnchor ?? "start"}"
                   font-weight="${taglineRule.fontWeight ?? "normal"}"
                 >
                   ${escapeXml(tagline.toUpperCase())}
                 </text>`
              : ""
          }
        </svg>
      `;

      // 9. Render with puppeteer (same robust pattern as wedding router)
      let finalImageBuffer: Buffer;
      try {
        const browser = await puppeteer.launch({
          args: chromium.args,
          defaultViewport: null,
          executablePath:
            process.env.NODE_ENV === "development"
              ? (await import("puppeteer")).executablePath()
              : await chromium.executablePath(),
          headless: true,
        });

        const page = await browser.newPage();
        // IMPORTANT: set high deviceScaleFactor for crisp text like wedding
        await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
        await page.setContent(svg, { waitUntil: "domcontentloaded" });

        const screenshotData = await page.screenshot({ omitBackground: true });
        await browser.close();

        finalImageBuffer = Buffer.from(screenshotData);
      } catch (err) {
        console.error("PUPPETEER ERROR:", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Render failed" });
      }

      // 10. Save to S3 and return public URL
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
