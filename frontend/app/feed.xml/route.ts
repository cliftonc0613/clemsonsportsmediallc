import { getPosts, stripHtml, decodeHtmlEntities } from '@/lib/wordpress';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Starter WP Theme';
const SITE_DESCRIPTION = 'Latest blog posts and updates';

/**
 * RSS Feed Route
 *
 * Generates an RSS 2.0 feed for blog posts.
 * Accessible at /feed.xml
 *
 * Benefits:
 * - SEO: Search engines can discover and index content
 * - Syndication: Readers can subscribe via RSS readers
 * - Social: Some platforms use RSS for content discovery
 */
export async function GET() {
  try {
    // Fetch latest posts
    const posts = await getPosts({ per_page: 20, orderby: 'date', order: 'desc' });

    // Build RSS XML
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>Next.js</generator>
    ${posts
      .map((post) => {
        const title = decodeHtmlEntities(post.title.rendered);
        const excerpt = stripHtml(post.excerpt.rendered);
        const content = post.content.rendered;
        const pubDate = new Date(post.date).toUTCString();
        const link = `${SITE_URL}/blog/${post.slug}`;
        const author = post.author_name || 'Author';

        return `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(author)}</author>
      <description>${escapeXml(excerpt)}</description>
      <content:encoded><![CDATA[${content}]]></content:encoded>
      ${post.featured_image_url ? `<enclosure url="${escapeXml(post.featured_image_url)}" type="image/jpeg"/>` : ''}
    </item>`;
      })
      .join('')}
  </channel>
</rss>`;

    return new Response(rssXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('RSS feed generation error:', error);

    // Return empty feed on error
    const emptyFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
  </channel>
</rss>`;

    return new Response(emptyFeed, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });
  }
}

/**
 * Escape special XML characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
