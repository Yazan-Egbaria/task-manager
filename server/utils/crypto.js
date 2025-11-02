import crypto from "crypto";

export function sha256(str) {
  return crypto.createHash("sha256").update(str).digest("hex");
}

export function inMinutes(n) {
  return new Date(Date.now() + n * 60_000);
}
