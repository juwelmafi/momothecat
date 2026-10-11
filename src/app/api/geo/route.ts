import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // 1. Check manual cookie override
  const cookieCountry = req.cookies.get('user_country')?.value;

  // 2. Check query param
  const queryCountry = req.nextUrl.searchParams.get('country');

  // 3. Check Vercel or Cloudflare Edge Geo-IP header
  const vercelCountry = req.headers.get('x-vercel-ip-country');
  const cfCountry = req.headers.get('cf-ipcountry');

  const rawCountry = queryCountry || cookieCountry || vercelCountry || cfCountry || 'US';
  const country = rawCountry.toUpperCase();
  const isBD = country === 'BD';

  return NextResponse.json({
    country,
    isBD,
    source: queryCountry ? 'query' : cookieCountry ? 'cookie' : vercelCountry ? 'vercel_edge' : 'default',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const country = (body.country || 'US').toUpperCase();

    const response = NextResponse.json({
      success: true,
      country,
      isBD: country === 'BD',
    });

    // Save cookie for 365 days
    response.cookies.set('user_country', country, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}
