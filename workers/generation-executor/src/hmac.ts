import { createHmac, timingSafeEqual } from "node:crypto";

export function signExecutorBody(secret: string, timestamp: string, body: string) {
  return createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");
}

export function verifyExecutorBody(
  secret: string,
  timestamp: string,
  body: string,
  signature: string,
  now = Date.now(),
): boolean {
  const parsed = Number(timestamp);
  if (!Number.isSafeInteger(parsed) || Math.abs(now - parsed) > 5 * 60 * 1000)
    return false;
  const expected = Buffer.from(signExecutorBody(secret, timestamp, body), "hex");
  const received = Buffer.from(signature, "hex");
  return expected.length === received.length && timingSafeEqual(expected, received);
}
