// src/server/api/routers/mautic.ts
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { syncUserToMautic } from "./mautic-utils"; // Assuming this is correctly named now
export const mauticRouter = createTRPCRouter({
    syncContacts: protectedProcedure.mutation(async ({ ctx }) => {
        var _a, _b, _c, _d;
        // ... your syncContacts logic ...
        const usersFromDb = await ctx.prisma.user.findMany({
            where: { email: { not: null } },
        });
        console.log(`MAUTIC_CRON: Fetched ${usersFromDb.length} users for Mautic sync.`);
        let processedCount = 0;
        let errorCount = 0;
        for (const user of usersFromDb) {
            if (!user.email) {
                console.warn(`MAUTIC_CRON: Skipping user ${user.id} with no email.`);
                continue;
            }
            try {
                // Determine currentBrand - FOR A CRON JOB, THIS IS TRICKY
                // If this cron is for gaminglogoai.com, then:
                const currentBrandForSync = 'gaminglogoai'; // HARDCODE FOR THIS CRON
                console.log(`MAUTIC_CRON: Syncing ${user.email} for brand ${currentBrandForSync}`);
                const mauticResult = await syncUserToMautic({
                    email: user.email,
                    name: user.name,
                    // You need to decide what credits/plan to send from a cron job
                    // Maybe only basic info + brand association? Or latest known credits?
                    // For gaminglogoai, it would be gamingCredits and gamingPlan
                    brand_specific_credits: (_a = user.gamingCredits) !== null && _a !== void 0 ? _a : 0,
                    brand_specific_plan: (_c = (_b = user.gamingPlan) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : "None", // Assuming gamingPlan
                }, currentBrandForSync);
                if (mauticResult.errors) {
                    console.error(`MAUTIC_CRON: Error syncing Mautic for ${user.email}:`, mauticResult.errors);
                    errorCount++;
                }
                else {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    console.log(`MAUTIC_CRON: Successfully synced Mautic for ${user.email}. Contact ID: ${(_d = mauticResult.contact) === null || _d === void 0 ? void 0 : _d.id}`);
                    processedCount++;
                }
            }
            catch (err) {
                console.error(`MAUTIC_CRON: Exception syncing Mautic for ${user.email}:`, err);
                errorCount++;
            }
        }
        return {
            message: "Mautic contacts sync attempt complete.",
            total: usersFromDb.length,
            processedSuccessfully: processedCount,
            errors: errorCount,
        };
    }),
});
