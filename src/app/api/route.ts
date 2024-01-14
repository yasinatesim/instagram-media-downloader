import { NextResponse } from 'next/server';

import { execSync } from 'child_process';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return new NextResponse(JSON.stringify({ error: 'Please provide a URL' }), { status: 400 });
    }

    if (url.includes('instagram')) {
      // Fetch post and reels
      if (url.includes('/p/') || url.includes('/reel/')) {
        const finalUrl = `${url}?__a=1&__d=dis`;

        return new NextResponse(JSON.stringify({ url: finalUrl }), {
          status: 200,
        });
      } else {
        // fetch stories

        const usernameMatch = url.match(/instagram\.com\/stories\/([^/]+)\//);
        const username = usernameMatch && usernameMatch[1];

        try {
          const finalUrl = `https://www.instagram.com/${username}?__a=1&__d=dis`;

          // StoriesPage için özel işlemler
          // const finalUrl = `https://www.instagram.com/graphql/query/?query_hash=de8017ee0a7c9c45ec4260733d81ea31&variables={"reel_ids":["${userId}"],"tag_names":[],"location_ids":[],"highlight_reel_ids":[],"precomposed_overlay":false,"show_story_viewer_list":true,"story_viewer_fetch_count":50,"story_viewer_cursor":""}`;

          // Curl çıktısını geri döndürme
          return new NextResponse(JSON.stringify({ url: finalUrl }), {
            status: 200,
          });
        } catch (error) {
          return new NextResponse(JSON.stringify({ error: 'Error fetching URL. Please try again' }), {
            status: 500,
          });
        }
      }
    }
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'An error occurred while processing the request' }), {
      status: 500,
    });
  }
}
