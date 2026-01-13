import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const userId = process.env.IG_USER_ID;
    const token = process.env.IG_ACCESS_TOKEN;
    if (!userId || !token) {
      return NextResponse.json({ error: 'Instagram Graph API not configured' }, { status: 500 });
    }
    const url = `https://graph.instagram.com/${encodeURIComponent(userId)}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${encodeURIComponent(token)}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return NextResponse.json({ error: `Upstream ${res.status}` }, { status: res.status });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Instagram Graph proxy error' }, { status: 500 });
  }
}

