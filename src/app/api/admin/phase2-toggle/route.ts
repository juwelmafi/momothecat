import { NextRequest, NextResponse } from 'next/server';
import { executePhase2Flip } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action === 'drop' ? 'drop' : 'archive';
    const result = await executePhase2Flip(action);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
