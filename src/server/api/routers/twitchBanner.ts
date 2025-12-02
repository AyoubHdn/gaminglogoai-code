/* eslint-disable @typescript-eslint/restrict-plus-operands */
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
    .input(z.object({
      styleId: z.string(),
      channelName: z.string(),
      tagline: z.string().optional(),
      logoUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      console.log("🟦 [TB] START GENERATE", input);

      try {
        const { styleId, channelName, tagline = "", logoUrl = "" } = input;

        console.log("🟩 [TB] Loading style…");
        const style = TWITCH_BANNER_STYLES.find((s) => s.id === styleId);
        if (!style) {
          console.log("❌ [TB] STYLE NOT FOUND");
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid style" });
        }

        const W = style.styleRules.canvasWidth;
        const H = style.styleRules.canvasHeight;

        console.log("🟩 [TB] Deducting credits…");
        const creditsNeeded = style.creditCost ?? 2;
        const { count } = await ctx.prisma.user.updateMany({
          where: { id: ctx.session.user.id, gamingCredits: { gte: creditsNeeded } },
          data: { gamingCredits: { decrement: creditsNeeded } },
        });
        if (count <= 0) {
          console.log("❌ [TB] Not enough credits");
          throw new TRPCError({ code: "BAD_REQUEST", message: "Not enough credits" });
        }

        console.log("🟩 [TB] Loading background:", style.backgroundSrc);
        const bgPath = path.join(process.cwd(), "public", style.backgroundSrc.replace(/^\//, ""));

        if (!fs.existsSync(bgPath)) {
          console.log("❌ [TB] Background not found at:", bgPath);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Background image missing" });
        }

        let bgBuffer = fs.readFileSync(bgPath);

        // LOGO COMPOSITE
        if (style.styleRules.photo && logoUrl) {
          console.log("🟦 [TB] Fetching user logo:", logoUrl);
          try {
            const resp = await fetch(logoUrl);
            if (!resp.ok) throw new Error("Fetch failed: " + resp.status);
            const buf = Buffer.from(await resp.arrayBuffer());

            console.log("🟩 [TB] Resizing logo…");
            const { x, y, width, height } = style.styleRules.photo;
            const resized = await sharp(buf).resize(width, height).png().toBuffer();

            console.log("🟩 [TB] Compositing logo…");
            bgBuffer = await sharp(bgBuffer)
              .composite([{ input: resized, left: x, top: y }])
              .png()
              .toBuffer();
          } catch (e) {
            console.error("❌ [TB] Logo composite failed:", e);
          }
        }

        console.log("🟩 [TB] Resizing background for puppeteer…");
        const resizedBackground = await sharp(bgBuffer)
          .resize(W, H, { fit: "cover" })
          .png()
          .toBuffer();

        const bgDataUrl = `data:image/png;base64,${resizedBackground.toString("base64")}`;

        // FONTS
        console.log("🟩 [TB] Loading fonts…");
        const fonts = style.styleRules.fonts;
        if (!fonts || Object.keys(fonts).length === 0) {
          console.log("❌ [TB] No fonts found in style");
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "No fonts defined in style rules.",
          });
        }

        const fontFaces = Object.entries(fonts).map(([k, f]) => {
          const fp = path.join(process.cwd(), "public", "fonts", f.file);
          if (!fs.existsSync(fp)) {
            console.log("❌ [TB] Missing font file:", fp);
            return "";
          }
          return "";
        });

        console.log("🟩 [TB] Building SVG…");

        if (!style.styleRules.elements?.channelName) {
          console.log("❌ [TB] Channel name element not configured in style");
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Channel name element not configured in style rules.",
          });
        }

        const channelNameEl = style.styleRules.elements.channelName;
        const svg = `
          <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
            <image href="${bgDataUrl}" width="${W}" height="${H}" />
            <text x="${channelNameEl.x}"
                  y="${channelNameEl.y}"
                  font-size="${channelNameEl.fontSize}"
                  fill="${channelNameEl.color}">
              ${channelName.toUpperCase()}
            </text>
          </svg>
        `;

        console.log("🟩 [TB] Launching Chromium…");

        let browser;
        try {
          browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: true,
          });
        } catch (err) {
          console.error("❌ [TB] Chromium launch failed:", err);
          throw new Error("Chromium launch failed");
        }

        console.log("🟩 [TB] Rendering SVG…");

        const page = await browser.newPage();
        await page.setViewport({ width: W, height: H });
        await page.setContent(svg, { waitUntil: "domcontentloaded" });

        const screenshot = await page.screenshot({ type: "png" });
        await browser.close();

        console.log("🟩 [TB] Uploading banner to S3…");

        const icon = await ctx.prisma.icon.create({
          data: {
            prompt: `TwitchBanner:${styleId}:${channelName}`,
            userId: ctx.session.user.id,
          },
        });

        await s3.putObject({
          Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_GAMING,
          Key: icon.id,
          Body: screenshot,
          ContentType: "image/png",
        }).promise();

        console.log("🟩 [TB] DONE!");
        return [{ imageUrl: `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_GAMING}.s3.${env.NEXT_PUBLIC_AWS_REGION_GAMING}.amazonaws.com/${icon.id}` }];
      } catch (err) {
        console.error("❌ [TB] FINAL ERROR:", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Banner generation failed." });
      }
    }),
});
