import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@momothecat.shop';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'momo2026admin';
const SESSION_COOKIE_NAME = 'momo_admin_session';
const SESSION_TOKEN = 'momo_cat_authenticated_admin_session_token';

// GET: Check current admin authentication status
export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME);

    if (session && session.value === SESSION_TOKEN) {
      return NextResponse.json({
        authenticated: true,
        user: { email: DEFAULT_ADMIN_EMAIL, role: 'admin' },
      });
    }

    return NextResponse.json({ authenticated: false });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}

// POST: Log in with email & password
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide both email and password' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const targetEmail = DEFAULT_ADMIN_EMAIL.trim().toLowerCase();

    // Validate credentials
    if (cleanEmail === targetEmail && password === DEFAULT_ADMIN_PASSWORD) {
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE_NAME, SESSION_TOKEN, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
      });

      return NextResponse.json({
        success: true,
        message: 'Admin authentication successful',
        user: { email: cleanEmail, role: 'admin' },
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid admin email or password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'An internal error occurred during login' },
      { status: 500 }
    );
  }
}

// DELETE: Log out
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);

    return NextResponse.json({
      success: true,
      message: 'Admin logged out successfully',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Logout failed' }, { status: 500 });
  }
}
