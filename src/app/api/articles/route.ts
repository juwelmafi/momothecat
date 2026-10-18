import { NextResponse } from 'next/server';
import { getArticles, createArticle } from '@/lib/store';

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const articles = await getArticles({ category, status, search, limit });
    return NextResponse.json({ success: true, articles });
  } catch (error) {
    console.error('GET /api/articles error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.excerpt || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Title, excerpt, and content are required' },
        { status: 400 }
      );
    }

    const created = await createArticle(body);
    return NextResponse.json({ success: true, article: created }, { status: 201 });
  } catch (error) {
    console.error('POST /api/articles error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
