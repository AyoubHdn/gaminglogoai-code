export const config = {
    runtime: "nodejs",
};
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { cpxUnlock } from "../cpxUnlock";
async function isVpnOrProxy(ip) {
    var _a;
    if (!ip)
        return false;
    try {
        const res = await fetch(`https://api.ipapi.is/?q=${ip}&key=${process.env.IPAPI_KEY}`, { method: "GET" });
        const data = await res.json();
        console.log("IPAPI response:", data);
        return Boolean((data === null || data === void 0 ? void 0 : data.is_vpn) === true ||
            (data === null || data === void 0 ? void 0 : data.is_proxy) === true ||
            (data === null || data === void 0 ? void 0 : data.is_tor) === true ||
            (data === null || data === void 0 ? void 0 : data.is_datacenter) === true ||
            ((_a = data === null || data === void 0 ? void 0 : data.company) === null || _a === void 0 ? void 0 : _a.type) === "hosting");
    }
    catch (_b) {
        // Fail-open (CPX prefers availability over false blocks)
        return false;
    }
}
export default async function handler(req, res) {
    var _a, _b, _c, _d;
    if (req.method !== "POST") {
        return res.status(405).end("Method not allowed");
    }
    // 1️⃣ Require login
    const session = await getServerSession(req, res, authOptions);
    if (!((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id)) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    // 🔐 VPN / Proxy protection (CPX requirement)
    const ip = (_d = (_c = (_b = req.headers["x-forwarded-for"]) === null || _b === void 0 ? void 0 : _b.split(",")[0]) !== null && _c !== void 0 ? _c : req.socket.remoteAddress) !== null && _d !== void 0 ? _d : null;
    const vpnDetected = await isVpnOrProxy(ip);
    if (vpnDetected) {
        return res.status(403).json({
            error: "Please disable VPN or proxy to access surveys. This helps ensure survey availability for your region.",
        });
    }
    const now = new Date();
    // 🔹 Expire old pending surveys (30 minutes TTL)
    const expireBefore = new Date(now.getTime() - 30 * 60 * 1000);
    await prisma.cpaUnlock.updateMany({
        where: {
            userId: session.user.id,
            network: "cpx",
            status: "pending",
            createdAt: { lt: expireBefore },
        },
        data: { status: "rejected" },
    });
    // 2️⃣ Check for still-valid pending survey
    const pendingCutoff = new Date(now.getTime() - 30 * 60 * 1000);
    const existing = await prisma.cpaUnlock.findFirst({
        where: {
            userId: session.user.id,
            network: "cpx",
            status: "pending",
            createdAt: { gt: pendingCutoff },
        },
        orderBy: { createdAt: "desc" },
    });
    if (existing) {
        const elapsedMs = now.getTime() - existing.createdAt.getTime();
        const remainingMs = Math.max(0, 30 * 60 * 1000 - elapsedMs);
        const remainingMinutes = Math.ceil(remainingMs / 60000);
        return res.status(400).json({
            error: "You already have a pending survey",
            retryAfterMinutes: remainingMinutes,
        });
    }
    const result = await cpxUnlock(session.user.id);
    return res.status(200).json(result);
}
