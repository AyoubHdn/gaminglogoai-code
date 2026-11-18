import { loadStripe } from "@stripe/stripe-js";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_KEY);
export function useBuyCredits() {
    const checkout = api.checkout.createCheckout.useMutation();
    return {
        buyCredits: async (plan) => {
            try {
                const response = await checkout.mutateAsync({ plan }); // Send plan instead of priceId
                const stripe = await stripePromise;
                await (stripe === null || stripe === void 0 ? void 0 : stripe.redirectToCheckout({
                    sessionId: response.id,
                }));
            }
            catch (error) {
                console.error("Error in buyCredits:", error);
                throw error;
            }
        },
    };
}
