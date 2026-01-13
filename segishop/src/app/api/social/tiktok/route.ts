import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('num') || '10';
    const username = searchParams.get('user') || 'thesegishop';
    const feedId = searchParams.get('feed') || '';
    const base = process.env.WP_API_BASE || 'https://segishop.com/wp-json';
    const apiUrl = `${base}/sbtt/v1/feed?num=${encodeURIComponent(limit)}&user=${encodeURIComponent(username)}${feedId ? `&feed=${encodeURIComponent(feedId)}` : ''}`;

    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) return NextResponse.json({ error: `Upstream ${res.status}` }, { status: res.status });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'TikTok proxy error' }, { status: 500 });
  }
}

