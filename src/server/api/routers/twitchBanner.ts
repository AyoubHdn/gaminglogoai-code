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

const BUCKET: string | undefined = env.NEXT_PUBLIC_S3_BUCKET_NAME_GAMING;

if (!BUCKET) {
  throw new Error("S3 bucket for gaming banners is not configured.");
}

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
      const style = TWITCH_BANNER_STYLES.find((s) => s.id === styleId);
      if (!style)
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid style" });

      const W = style.styleRules.canvasWidth;
      const H = style.styleRules.canvasHeight;

      // 2. Credits
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

      // 4. Optional Logo compositing
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

      // SAFE resize background for Puppeteer (prevents Chromium crash)
      const resizedBackground = await sharp(bgBuffer)
        .resize(style.styleRules.canvasWidth, style.styleRules.canvasHeight, {
          fit: "cover",
        })
        .png()
        .toBuffer();

      const backgroundDataUrl = `data:image/png;base64,${resizedBackground.toString("base64")}`;

      // 5. Load fonts safely
      const fonts = style.styleRules.fonts;
      if (!fonts || Object.keys(fonts).length === 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No fonts defined in style rules.",
        });
      }

      const fontFaces = Object.entries(fonts)
        .map(([key, font]) => {
          const fp = path.join(process.cwd(), "public", "fonts", font.file);
          if (!fs.existsSync(fp)) {
            console.warn(`Missing font file: ${fp}`);
            return "";
          }
          const base = fs.readFileSync(fp).toString("base64");
          return `@font-face {
            font-family: '${escapeXml(font.family)}';
            src: url(data:font/ttf;base64,${base}) format('truetype');
          }`;
        })
        .join("\n");

      // --- 6. SAFE ELEMENT ACCESS ---
      const elements = style.styleRules.elements;
      if (!elements) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Missing text elements in style.",
        });
      }

      const channelNameRule = elements.channelName;
      const taglineRule = elements.tagline;

      if (!channelNameRule) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Style is missing channelName element.",
        });
      }

      // tagline is optional (just skip rendering)
      const hasTagline = tagline && tagline.trim().length > 0;

      // --- SAFE FONT RESOLUTION ---
      function resolveFont(ruleFontFamily: string) {
        const found = fonts[ruleFontFamily];
        if (!found) {
          console.warn(`Font family '${ruleFontFamily}' not found. Falling back to sans-serif.`);
          return { family: "sans-serif" };
        }
        return found;
      }

      const channelFont = resolveFont(channelNameRule.fontFamily);
      const taglineFont = taglineRule ? resolveFont(taglineRule.fontFamily) : null;

      // --- 7. BUILD SVG ---
      const svg = `
      <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
        <style>${fontFaces}</style>

        <image href="${backgroundDataUrl}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" />

        <text
          x="${channelNameRule.x}"
          y="${channelNameRule.y}"
          font-family="${escapeXml(channelFont.family)}"
          font-size="${channelNameRule.fontSize}"
          fill="${channelNameRule.color}"
          letter-spacing="${channelNameRule.letterSpacing ?? 0}"
          text-anchor="${channelNameRule.textAnchor ?? "start"}"
          font-weight="${channelNameRule.fontWeight ?? "bold"}"
        >
          ${escapeXml(channelName.toUpperCase())}
        </text>

        ${
          hasTagline && taglineRule && taglineFont
            ? `
        <text
          x="${taglineRule.x}"
          y="${taglineRule.y}"
          font-family="${escapeXml(taglineFont.family)}"
          font-size="${taglineRule.fontSize}"
          fill="${taglineRule.color}"
          letter-spacing="${taglineRule.letterSpacing ?? 0}"
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


      // 7. Puppeteer Render
      let finalImageBuffer: Buffer;
      try {
      const canvasWidth = style.styleRules.canvasWidth ?? 1200;
      const canvasHeight = style.styleRules.canvasHeight ?? 480;

      const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: {
          width: canvasWidth,
          height: canvasHeight,
        },
        executablePath:
          process.env.NODE_ENV === "development"
            ? (await import("puppeteer")).executablePath()  // local: full Chrome
            : await chromium.executablePath(),             // production: serverless chromium
        headless: true,
      });

        const page = await browser.newPage();
        await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });

        await page.setContent(svg, { waitUntil: "domcontentloaded" });

        const screenshot = await page.screenshot({ type: "png", omitBackground: false });
        await browser.close();

        finalImageBuffer = Buffer.from(screenshot);
      } catch (err) {
        console.error("Puppeteer error:", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Render failed" });
      }

      // 8. Save DB + S3
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
