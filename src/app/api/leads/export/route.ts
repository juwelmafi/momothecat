import { NextRequest, NextResponse } from 'next/server';
import { getLeads } from '@/lib/store';
import { verifyAdminSession } from '@/lib/auth';

// GET: Export leads database as CSV (Protected Admin Endpoint)
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

    // Generate CSV
    const headers = ['Email', 'Source', 'Discount Code', 'Captured Date'];
    const rows = leads.map((lead) => [
      `"${lead.email}"`,
      `"${lead.source}"`,
      `"${lead.discountCode}"`,
      `"${new Date(lead.createdAt).toISOString()}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="momo_the_cat_leads_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
