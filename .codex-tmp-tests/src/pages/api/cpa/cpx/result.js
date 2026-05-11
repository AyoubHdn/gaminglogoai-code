// /pages/api/cpa/cpx/result.ts
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
export default async function handler(req, res) {
    var _a;
    const session = await getServerSession(req, res, authOptions);
    if (!((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id)) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const unlock = await prisma.cpaUnlock.findFirst({
        where: {
            userId: session.user.id,
            network: "cpx",
        },
        orderBy: { createdAt: "desc" },
    });
    if (!unlock) {
        return res.json({ status: "pending" });
    }
    if (unlock.status === "approved" && unlock.payout && unlock.payout > 0) {
        return res.json({
            status: "approved",
            payout: unlock.payout,
        });
    }
    if (unlock.status === "approved" && (!unlock.payout || unlock.payout === 0)) {
        return res.json({
            status: "screenout",
        });
    }
    if (unlock.status === "rejected") {
        return res.json({
            status: "rejected",
        });
    }
    return res.json({ status: "pending" });
}
