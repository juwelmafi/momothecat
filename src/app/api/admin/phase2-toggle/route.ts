import { NextRequest, NextResponse } from 'next/server';
import { executePhase2Flip } from '@/lib/store';
import { verifyAdminSession } from '@/lib/auth';

// POST: Execute Phase 2 catalog flip (Protected Admin Endpoint)
export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminSession(req);
    if (!session.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const action = body.action === 'drop' ? 'drop' : 'archive';
    const result = await executePhase2Flip(action);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
