-- Persist the successful-payment signal independently from the user's
-- remaining credit balance or legacy plan label.
ALTER TABLE "User"
ADD COLUMN "hasPurchasedCredits" BOOLEAN NOT NULL DEFAULT false;

-- Preserve clean downloads for existing customers. Before this column,
-- gamingPlan was the only local value written by the successful Stripe
-- checkout webhook and was never reset when credits were exhausted.
UPDATE "User"
SET "hasPurchasedCredits" = true
WHERE "gamingPlan" <> 'None';
