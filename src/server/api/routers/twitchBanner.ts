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
  // src/server/api/routers/twitchBanner.ts  (replace the mutation with below)
  generate: protectedProcedure
  .input(z.object({
    styleId: z.string(),
    channelName: z.string(),
    tagline: z.string().optional(),
    logoUrl: z.string().optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    console.log("[TB] generate called:", { userId: ctx.session.user.id, input });

    const { styleId, channelName, tagline = "", logoUrl = "" } = input;

    // style load + credits (same as before)...
    const style = TWITCH_BANNER_STYLES.find(s => s.id === styleId);
    if (!style) {
      console.error("[TB] invalid styleId:", styleId);
      throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid banner style" });
    }

    const W = style.styleRules.canvasWidth;
    const H = style.styleRules.canvasHeight;

    // credits check omitted here for brevity — keep your current logic
    // ---------------------------------------------------------------

    console.log("[TB] background src:", style.backgroundSrc);
    const bgPath = path.join(process.cwd(), "public", style.backgroundSrc.replace(/^\//, ""));
    if (!fs.existsSync(bgPath)) {
      console.error("[TB] background file missing:", bgPath);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Background image missing" });
    }
    let bgBuffer = fs.readFileSync(bgPath);

    // If user uploaded a logo, verify we can reach it BEFORE compositing
    if (style.styleRules.photo && logoUrl) {
      console.log("[TB] logoUrl present. Attempting to fetch HEAD:", logoUrl);
      try {
        // First attempt a HEAD to save bandwidth (some servers block HEAD; fallback to GET)
        let resp = await fetch(logoUrl, { method: "HEAD", redirect: "follow" });
        if (!resp.ok) {
          console.warn("[TB] HEAD failed or returned non-OK. Trying GET. status:", resp.status);
          resp = await fetch(logoUrl, { method: "GET", redirect: "follow" });
        }
        if (!resp.ok) {
          console.error("[TB] Could not fetch logoUrl. status:", resp.status, "url:", logoUrl);
          // don't swallow — return helpful error for client
          throw new TRPCError({ code: "BAD_REQUEST", message: `Could not fetch uploaded image (status ${resp.status}).` });
        }
        const arrayBuffer = await resp.arrayBuffer();
        const logoBuf = Buffer.from(arrayBuffer);

        console.log("[TB] Fetched uploaded logo. size:", logoBuf.length);
        // Resize / composite using style.styleRules.photo
        const { x, y, width, height } = style.styleRules.photo;
        const resizedLogo = await sharp(logoBuf).resize(width, height, { fit: 'cover' }).png().toBuffer();
        bgBuffer = await sharp(bgBuffer).composite([{ input: resizedLogo, left: x, top: y }]).png().toBuffer();
      } catch (err) {
        console.error("[TB] logo fetch/composite error:", err);
        // Refund credits here if you already decremented (your existing flow)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch or process uploaded image." });
      }
    }

    // proceed to build svg & render (leave your existing code) but add a few logs:
    console.log("[TB] resized background done, building svg");
    // ... rest of your svg build and puppeteer rendering
    // make sure to console.log before each async stage: launching chromium, setting content, screenshot result length, s3 upload success
  })
});
