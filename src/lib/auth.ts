import crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export const SESSION_COOKIE_NAME = 'momo_admin_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const ADMIN_SECRET =
  process.env.NEXTAUTH_SECRET ||
  process.env.ADMIN_SECRET ||
  'momo_the_cat_super_secret_key_2026_prod';

export const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@momothecat.shop';
export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'momo2026admin';

// In-memory rate limiting map for login attempts: ip -> { count: number, firstAttemptTime: number, lockedUntil: number }
interface RateLimitRecord {
  count: number;
  firstAttemptTime: number;
  lockedUntil: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes lockout

export function checkLoginRateLimit(ip: string): { allowed: boolean; remainingSeconds?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    return { allowed: true };
  }

  // Check if actively locked out
  if (record.lockedUntil > now) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingSeconds };
  }

  // If lockout window passed, reset
  if (now - record.firstAttemptTime > LOCKOUT_WINDOW_MS) {
    rateLimitStore.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedLoginAttempt(ip: string): { locked: boolean; remainingSeconds?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now - record.firstAttemptTime > LOCKOUT_WINDOW_MS) {
    rateLimitStore.set(ip, {
      count: 1,
      firstAttemptTime: now,
      lockedUntil: 0,
    });
    return { locked: false };
  }

  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_WINDOW_MS;
    const remainingSeconds = Math.ceil(LOCKOUT_WINDOW_MS / 1000);
    return { locked: true, remainingSeconds };
  }

  return { locked: false };
}

export function resetLoginRateLimit(ip: string): void {
  rateLimitStore.delete(ip);
}

// Timing-safe string comparison
export function timingSafeCompare(a: string, b: string): boolean {
  try {
    const bufA = crypto.createHash('sha256').update(String(a)).digest();
    const bufB = crypto.createHash('sha256').update(String(b)).digest();
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// Generate cryptographically signed HMAC-SHA256 session token
export function generateAdminSessionToken(email: string): string {
  const payload = {
    sub: email,
    role: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };

  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(payloadEncoded)
    .digest('base64url');

  return `${payloadEncoded}.${signature}`;
}

// Verify HMAC-SHA256 session token
export function verifyAdminSessionToken(token: string | undefined | null): {
  valid: boolean;
  email?: string;
} {
  if (!token || typeof token !== 'string') {
    return { valid: false };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false };
  }

  const [payloadEncoded, signature] = parts;

  try {
    // Recompute signature and compare timing-safely
    const expectedSignature = crypto
      .createHmac('sha256', ADMIN_SECRET)
      .update(payloadEncoded)
      .digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expSigBuf = Buffer.from(expectedSignature);

    if (sigBuf.length !== expSigBuf.length || !crypto.timingSafeEqual(sigBuf, expSigBuf)) {
      return { valid: false };
    }

    // Decode and validate expiration
    const payloadJson = Buffer.from(payloadEncoded, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return { valid: false };
    }

    if (payload.role !== 'admin') {
      return { valid: false };
    }

    return { valid: true, email: payload.sub };
  } catch {
    return { valid: false };
  }
}

// Helper to verify session in Next.js Server Components / Route Handlers
export async function verifyAdminSession(req?: NextRequest): Promise<{
  authenticated: boolean;
  email?: string;
}> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  }

  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    } catch {
      // Ignore if cookies() cannot be called
    }
  }

  if (!token) {
    return { authenticated: false };
  }

  const verification = verifyAdminSessionToken(token);
  return {
    authenticated: verification.valid,
    email: verification.email,
  };
}

// Client IP resolver helper for rate limiting
export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
