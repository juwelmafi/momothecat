import { NextRequest, NextResponse } from 'next/server';
import { getLeads, createLead } from '@/lib/store';
import { verifyAdminSession } from '@/lib/auth';

// GET: Fetch all leads (Protected Admin Endpoint)
export async function GET(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const leads = await getLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Subscribe new lead (Public Customer Opt-in)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email address is required' }, { status: 400 });
    }

    const result = await createLead(email, source);
    return NextResponse.json({
      success: true,
      code: result.code,
      message: result.isNew ? 'Welcome! Your 10% discount code is MOMO10' : 'Welcome back! Your code is MOMO10',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
