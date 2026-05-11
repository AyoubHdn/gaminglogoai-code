import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { prisma } from "../../db";
import { withCreditTransaction } from "../creditTransaction";
async function main() {
    const baseEmail = `credit-transaction-${randomUUID()}@example.com`;
    const successUser = await prisma.user.create({
        data: {
            email: baseEmail,
            gamingCredits: 9,
        },
    });
    const failureUser = await prisma.user.create({
        data: {
            email: `refund-${baseEmail}`,
            gamingCredits: 7,
        },
    });
    try {
        const successResult = await withCreditTransaction(successUser.id, 3, async () => {
            return {
                ok: true,
                marker: "success",
            };
        });
        const successUserAfter = await prisma.user.findUniqueOrThrow({
            where: {
                id: successUser.id,
            },
        });
        assert.deepEqual(successResult, {
            ok: true,
            marker: "success",
        });
        assert.equal(successUserAfter.gamingCredits, 6);
        console.log("PASS success path returns result and keeps the charged credits applied");
        const failureMessage = "simulated downstream failure";
        let caughtMessage = "";
        try {
            await withCreditTransaction(failureUser.id, 4, async () => {
                throw new Error(failureMessage);
            });
        }
        catch (error) {
            caughtMessage =
                error instanceof Error ? error.message : "Unknown failure was thrown";
        }
        const failureUserAfter = await prisma.user.findUniqueOrThrow({
            where: {
                id: failureUser.id,
            },
        });
        assert.equal(caughtMessage, failureMessage);
        assert.equal(failureUserAfter.gamingCredits, 7);
        console.log("PASS failure path refunds credits and rethrows the original error");
        const finalSuccessUser = await prisma.user.findUniqueOrThrow({
            where: {
                id: successUser.id,
            },
        });
        const finalFailureUser = await prisma.user.findUniqueOrThrow({
            where: {
                id: failureUser.id,
            },
        });
        assert.equal(finalSuccessUser.gamingCredits, 6);
        assert.equal(finalFailureUser.gamingCredits, 7);
        console.log("PASS both paths leave user credit balances in a consistent state");
        console.log("Passed 3/3 creditTransaction tests");
    }
    finally {
        await prisma.icon.deleteMany({
            where: {
                userId: {
                    in: [successUser.id, failureUser.id],
                },
            },
        });
        await prisma.account.deleteMany({
            where: {
                userId: {
                    in: [successUser.id, failureUser.id],
                },
            },
        });
        await prisma.session.deleteMany({
            where: {
                userId: {
                    in: [successUser.id, failureUser.id],
                },
            },
        });
        await prisma.user.deleteMany({
            where: {
                id: {
                    in: [successUser.id, failureUser.id],
                },
            },
        });
        await prisma.$disconnect();
    }
}
void main();
