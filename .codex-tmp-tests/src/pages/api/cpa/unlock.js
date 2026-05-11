import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { cpxUnlock } from "./cpxUnlock";
export default async function handler(req, res) {
    var _a;
    if (req.method !== "POST") {
        return res.status(405).end();
    }
    const session = await getServerSession(req, res, authOptions);
    if (!((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id)) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    // 🔒 CPX ONLY (MyLead disabled for now)
    const result = await cpxUnlock(session.user.id);
    return res.status(200).json(result);
}
