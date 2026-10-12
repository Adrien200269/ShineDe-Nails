// Simple shared in-memory OTP store with 15-minute expiration
interface StoredOtp {
  code: string;
  expiresAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __shinede_otp_store: Map<string, StoredOtp> | undefined;
}

const otpStore: Map<string, StoredOtp> =
  global.__shinede_otp_store || (global.__shinede_otp_store = new Map<string, StoredOtp>());

export function saveOtp(email: string, code: string, ttlMs: number = 15 * 60 * 1000) {
  const normalized = email.trim().toLowerCase();
  otpStore.set(normalized, {
    code,
    expiresAt: Date.now() + ttlMs,
  });
}

export function verifyOtp(email: string, code: string): boolean {
  const normalized = email.trim().toLowerCase();
  const stored = otpStore.get(normalized);

  if (!stored) return false;

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(normalized);
    return false;
  }

  if (stored.code === code.trim()) {
    otpStore.delete(normalized);
    return true;
  }

  return false;
}
