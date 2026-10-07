import { NextRequest, NextResponse } from 'next/server';
import { getLeads, createLead } from '@/lib/store';

export async function GET() {
  try {
    const leads = await getLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

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
