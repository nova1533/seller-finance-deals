import "server-only";
import crypto from "crypto";

const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30;

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("Set ADMIN_PASSWORD (and ideally ADMIN_SESSION_SECRET) in the environment.");
  return s;
}

export function signSession(): string {
  const payload = Date.now().toString();
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySession(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = crypto.createHmac("sha256", secret()).update(payload).digest("hex");
  if (sig.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  const age = Date.now() - Number(payload);
  return age >= 0 && age < THIRTY_DAYS_MS;
}
