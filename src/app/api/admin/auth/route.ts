import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  generateAdminSessionToken,
  verifyAdminSession,
  timingSafeCompare,
  checkLoginRateLimit,
  recordFailedLoginAttempt,
  resetLoginRateLimit,
  getClientIp,
} from '@/lib/auth';

// GET: Check current admin authentication status
export async function GET(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);

    if (session.authenticated) {
      return NextResponse.json({
        authenticated: true,
        user: { email: session.email || DEFAULT_ADMIN_EMAIL, role: 'admin' },
      });
    }

    return NextResponse.json({ authenticated: false });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

// POST: Log in with email/username & password
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Please provide both email/username and password', message: 'Please provide both email/username and password' },
        { status: 400 }
      );
    }

    const cleanInput = String(email).trim().toLowerCase();
    const targetEmail = DEFAULT_ADMIN_EMAIL.trim().toLowerCase();
    const targetUsername = targetEmail.split('@')[0];

    // Validate email or username
    const isEmailOrUsernameMatch =
      timingSafeCompare(cleanInput, targetEmail) ||
      timingSafeCompare(cleanInput, 'admin') ||
      timingSafeCompare(cleanInput, targetUsername);

    // Validate password using timing-safe comparison to prevent timing attacks
    const isPasswordMatch = timingSafeCompare(String(password).trim(), DEFAULT_ADMIN_PASSWORD.trim());

    if (isEmailOrUsernameMatch && isPasswordMatch) {
      // Clear failed rate limit attempts immediately upon successful login
      resetLoginRateLimit(ip);

      // Generate signed, tamper-proof session token
      const token = generateAdminSessionToken(DEFAULT_ADMIN_EMAIL);

      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: SESSION_MAX_AGE_SECONDS,
        sameSite: 'lax',
      });

      return NextResponse.json({
        success: true,
        message: 'Admin authentication successful',
        user: { email: DEFAULT_ADMIN_EMAIL, role: 'admin' },
      });
    }

    // Rate Limiting Check on failed credentials
    const rateLimit = checkLoginRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed login attempts. Please wait ${rateLimit.remainingSeconds || 60}s.`,
          message: `Too many failed login attempts. Please wait ${rateLimit.remainingSeconds || 60}s.`,
        },
        { status: 429 }
      );
    }

    // Record failed attempt
    const failedStatus = recordFailedLoginAttempt(ip);
    const errorMsg = failedStatus.locked
      ? `Too many failed attempts. Account temporarily locked for 15 minutes.`
      : 'Invalid admin credentials. Please check your username and password.';

    return NextResponse.json(
      { success: false, error: errorMsg, message: errorMsg },
      { status: failedStatus.locked ? 429 : 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'An internal error occurred during login', message: 'An internal error occurred during login' },
      { status: 500 }
    );
  }
}

// DELETE: Log out admin
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);

    return NextResponse.json({
      success: true,
      message: 'Admin logged out successfully',
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Logout failed' }, { status: 500 });
  }
}
