import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const username = process.env.TIKTOK_USERNAME || 'printoscar';
    const url = `https://www.tiktok.com/@${encodeURIComponent(username)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp',
      },
      cache: 'no-store'
    });
    if (!res.ok) return NextResponse.json({ error: `Upstream ${res.status}` }, { status: res.status });
    const html = await res.text();
    
    // Try SIGI_STATE first
    const sigiMatch = html.match(/<script id="SIGI_STATE" type="application\/json">([\s\S]*?)<\/script>/);
    let posts: any[] = [];
    
    if (sigiMatch) {
      try {
        const state = JSON.parse(sigiMatch[1]);
        const items = state?.ItemModule ? Object.values(state.ItemModule) : [];
        posts = (items as any[]).map((item) => ({
          id: item?.id || item?.video?.id,
          permalink: `https://www.tiktok.com/@${username}/video/${item?.id}`,
          cover_image_url: item?.video?.cover || item?.video?.originCover,
          title: item?.desc || '',
          like_count: item?.stats?.diggCount || 0,
          comment_count: item?.stats?.commentCount || 0,
          share_count: item?.stats?.shareCount || 0,
          view_count: item?.stats?.playCount || 0,
          username,
          avatar_url: state?.UserModule?.users?.[username]?.avatarLarger || '',
          display_name: state?.UserModule?.users?.[username]?.nickname || username,
          video_url: item?.video?.playAddr || '',
          create_time: item?.createTime ? new Date(item.createTime * 1000).toISOString() : new Date().toISOString(),
        }));
      } catch (err) {
        console.error('Error parsing SIGI_STATE:', err);
      }
    }

    // Try Universal Data if SIGI failed or returned empty
    if (posts.length === 0) {
      const universalMatch = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">([\s\S]*?)<\/script>/);
      if (universalMatch) {
        try {
          const data = JSON.parse(universalMatch[1]);
          const defaultScope = data?.["__DEFAULT_SCOPE__"];
          const userDetail = defaultScope?.["webapp.user-detail"];
          
          if (userDetail?.itemList) {
             // Map Universal Data structure
             // Note: Structure varies, need defensive coding
             const items = Object.values(userDetail.itemList).flat(); // or iterate if it's an object
             // Actually often it's userDetail.itemInfo.itemStruct if it's a video page, but for user profile:
             // userDetail.itemList might be just IDs. 
             // Let's check 'webapp.video-detail' or similar.
             // For user profile, it might be in `webapp.user-detail`.
             
             // Simplification: If we can't reliably parse Universal Data without more info, 
             // maybe we should just return empty and let the fallback handle it.
             // But let's try to find 'itemList' or 'items' in the blob.
          }
        } catch (err) {
           console.error('Error parsing Universal Data:', err);
        }
      }
    }
    
    // If still no posts, return empty (client will use fallback)
    return NextResponse.json({ posts });
  } catch (e: any) {
    console.error('TikTok scrape error:', e);
    return NextResponse.json({ error: e?.message || 'TikTok scrape error' }, { status: 500 });
  }
}

