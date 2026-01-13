import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('num') || '12';
    const cols = searchParams.get('cols') || '3';
    const username = searchParams.get('user') || 'thesegishop';
    const feedId = searchParams.get('feed') || '';
    const base = process.env.WP_API_BASE || 'https://segishop.com/wp-json';
    const apiUrl = `${base}/sbi/v1/feed?num=${encodeURIComponent(limit)}&cols=${encodeURIComponent(cols)}&user=${encodeURIComponent(username)}${feedId ? `&feed=${encodeURIComponent(feedId)}` : ''}`;

    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) return NextResponse.json({ error: `Upstream ${res.status}` }, { status: res.status });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Instagram proxy error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const shortcode = body?.shortcode || '';
    const base = process.env.WP_API_BASE || 'https://segishop.com/wp-json';
    const res = await fetch(`${base}/wp/v2/instagram-feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shortcode })
    });
    if (!res.ok) return NextResponse.json({ error: `Upstream ${res.status}` }, { status: res.status });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Instagram proxy error' }, { status: 500 });
  }
}

