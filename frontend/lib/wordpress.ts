/**
 * WordPress API Functions
 * Fetch functions for interacting with the WordPress REST API
 */

// Read env var dynamically each time (not cached at module load)
function getWordPressApiUrl(): string | undefined {
  return process.env.WORDPRESS_API_URL;
}

// Validation helper - throws clear error if API URL is not configured
function getApiUrl(): string {
  const url = getWordPressApiUrl();
  if (!url) {
    throw new Error(
      'WORDPRESS_API_URL environment variable is not set. ' +
      'Please set it in your .env.local file or Vercel environment variables. ' +
      'Example: https://your-site.com/wp-json/wp/v2'
    );
  }
  return url;
}

// Check if WordPress API is configured (useful for build-time checks)
export function isWordPressConfigured(): boolean {
  return !!getWordPressApiUrl();
}

// =============================================================================
// TypeScript Interfaces
// =============================================================================

/**
 * WordPress Media/Image
 */
export interface WPImage {
  id: number;
  url: string;
  alt: string;
  width: number;
  height: number;
  sizes: {
    thumbnail?: string;
    medium?: string;
    large?: string;
    full?: string;
  };
}

/**
 * ACF Image Field (from REST API)
 */
export interface ACFImage {
  ID: number;
  id: number;
  title: string;
  filename: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  sizes: {
    thumbnail: string;
    'thumbnail-width': number;
    'thumbnail-height': number;
    medium: string;
    'medium-width': number;
    'medium-height': number;
    large: string;
    'large-width': number;
    'large-height': number;
  };
}

/**
 * WordPress Author (embedded)
 */
export interface WPAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls?: {
    '24'?: string;
    '48'?: string;
    '96'?: string;
  };
}

/**
 * WordPress Post (Blog)
 */
export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  author_name?: string;
  featured_media: number;
  featured_image_url?: string | null;
  categories: number[];
  tags: number[];
  acf?: Record<string, unknown>;
  _embedded?: {
    author?: WPAuthor[];
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
      media_details?: {
        sizes?: {
          thumbnail?: { source_url: string };
          medium?: { source_url: string };
          large?: { source_url: string };
        };
      };
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: string;
    }>>;
  };
}

/**
 * WordPress Page
 */
export interface WPPage {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  featured_image_url?: string | null;
  parent: number;
  menu_order: number;
  template: string;
  acf?: Record<string, unknown>;
}

/**
 * Service Custom Post Type
 */
export interface WPService {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  featured_media: number;
  featured_image_url?: string | null;
  acf?: ServiceACF;
}

/**
 * Service ACF Fields
 */
export interface ServiceACF {
  pricing?: string;
  duration?: string;
  features?: Array<{ feature: string }>;
  cta_text?: string;
  cta_link?: string;
}

/**
 * Testimonial Custom Post Type
 */
export interface WPTestimonial {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  featured_media: number;
  featured_image_url?: string | null;
  acf?: TestimonialACF;
}

/**
 * Testimonial ACF Fields
 */
export interface TestimonialACF {
  client_name?: string;
  company?: string;
  quote?: string;
  photo?: ACFImage | null;
  rating?: number;
  related_service?: WPService | null;
}

/**
 * WordPress Category
 */
export interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  parent: number;
}

/**
 * WordPress Tag
 */
export interface WPTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
}

// =============================================================================
// API Fetch Functions
// =============================================================================

/**
 * Generic fetch function with error handling
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const apiUrl = getApiUrl();
  // Add cache-busting parameter to bypass Flywheel/Fastly CDN caching
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${apiUrl}${endpoint}${separator}_t=${Date.now()}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store', // Always fetch fresh data from WordPress
    ...options,
  });

  if (!response.ok) {
    throw new Error(`WordPress API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// =============================================================================
// Posts (Blog)
// =============================================================================

/**
 * Fetch all blog posts
 */
export async function getPosts(params?: {
  per_page?: number;
  page?: number;
  categories?: number[];
  tags?: number[];
  exclude?: number[];
  orderby?: string;
  order?: 'asc' | 'desc';
}): Promise<WPPost[]> {
  const queryParams = new URLSearchParams();

  if (params?.per_page) queryParams.set('per_page', params.per_page.toString());
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.categories?.length) queryParams.set('categories', params.categories.join(','));
  if (params?.tags?.length) queryParams.set('tags', params.tags.join(','));
  if (params?.exclude?.length) queryParams.set('exclude', params.exclude.join(','));
  if (params?.orderby) queryParams.set('orderby', params.orderby);
  if (params?.order) queryParams.set('order', params.order);

  // Always include _embed to get featured image data
  queryParams.set('_embed', 'true');

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchAPI<WPPost[]>(`/posts${query}`);
}

/**
 * Fetch a single blog post by slug
 */
export async function getPost(slug: string): Promise<WPPost | null> {
  const posts = await fetchAPI<WPPost[]>(`/posts?slug=${slug}&_embed=true`);
  return posts.length > 0 ? posts[0] : null;
}

/**
 * Fetch a single blog post by ID
 */
export async function getPostById(id: number): Promise<WPPost> {
  return fetchAPI<WPPost>(`/posts/${id}?_embed=true`);
}

// =============================================================================
// Pages
// =============================================================================

/**
 * Fetch all pages
 */
export async function getPages(params?: {
  per_page?: number;
  page?: number;
  parent?: number;
  orderby?: string;
  order?: 'asc' | 'desc';
}): Promise<WPPage[]> {
  const queryParams = new URLSearchParams();

  if (params?.per_page) queryParams.set('per_page', params.per_page.toString());
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.parent !== undefined) queryParams.set('parent', params.parent.toString());
  if (params?.orderby) queryParams.set('orderby', params.orderby);
  if (params?.order) queryParams.set('order', params.order);

  queryParams.set('_embed', 'true');

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchAPI<WPPage[]>(`/pages${query}`);
}

/**
 * Fetch a single page by slug
 */
export async function getPage(slug: string): Promise<WPPage | null> {
  const pages = await fetchAPI<WPPage[]>(`/pages?slug=${slug}&_embed=true`);
  return pages.length > 0 ? pages[0] : null;
}

/**
 * Fetch a single page by ID
 */
export async function getPageById(id: number): Promise<WPPage> {
  return fetchAPI<WPPage>(`/pages/${id}?_embed=true`);
}

// =============================================================================
// Services (Custom Post Type)
// =============================================================================

/**
 * Fetch all services
 */
export async function getServices(params?: {
  per_page?: number;
  page?: number;
  orderby?: string;
  order?: 'asc' | 'desc';
}): Promise<WPService[]> {
  const queryParams = new URLSearchParams();

  if (params?.per_page) queryParams.set('per_page', params.per_page.toString());
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.orderby) queryParams.set('orderby', params.orderby);
  if (params?.order) queryParams.set('order', params.order);

  queryParams.set('_embed', 'true');

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchAPI<WPService[]>(`/services${query}`);
}

/**
 * Fetch a single service by slug
 */
export async function getService(slug: string): Promise<WPService | null> {
  const services = await fetchAPI<WPService[]>(`/services?slug=${slug}&_embed=true`);
  return services.length > 0 ? services[0] : null;
}

/**
 * Fetch a single service by ID
 */
export async function getServiceById(id: number): Promise<WPService> {
  return fetchAPI<WPService>(`/services/${id}?_embed=true`);
}

// =============================================================================
// Testimonials (Custom Post Type)
// =============================================================================

/**
 * Fetch all testimonials
 */
export async function getTestimonials(params?: {
  per_page?: number;
  page?: number;
  orderby?: string;
  order?: 'asc' | 'desc';
}): Promise<WPTestimonial[]> {
  const queryParams = new URLSearchParams();

  if (params?.per_page) queryParams.set('per_page', params.per_page.toString());
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.orderby) queryParams.set('orderby', params.orderby);
  if (params?.order) queryParams.set('order', params.order);

  queryParams.set('_embed', 'true');

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchAPI<WPTestimonial[]>(`/testimonials${query}`);
}

/**
 * Fetch a single testimonial by slug
 */
export async function getTestimonial(slug: string): Promise<WPTestimonial | null> {
  const testimonials = await fetchAPI<WPTestimonial[]>(`/testimonials?slug=${slug}&_embed=true`);
  return testimonials.length > 0 ? testimonials[0] : null;
}

/**
 * Fetch a single testimonial by ID
 */
export async function getTestimonialById(id: number): Promise<WPTestimonial> {
  return fetchAPI<WPTestimonial>(`/testimonials/${id}?_embed=true`);
}

// =============================================================================
// Categories & Tags
// =============================================================================

/**
 * Fetch all categories
 */
export async function getCategories(params?: {
  per_page?: number;
  hide_empty?: boolean;
}): Promise<WPCategory[]> {
  const queryParams = new URLSearchParams();

  if (params?.per_page) queryParams.set('per_page', params.per_page.toString());
  if (params?.hide_empty !== undefined) queryParams.set('hide_empty', params.hide_empty.toString());

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchAPI<WPCategory[]>(`/categories${query}`);
}

/**
 * Fetch all tags
 */
export async function getTags(params?: {
  per_page?: number;
  hide_empty?: boolean;
}): Promise<WPTag[]> {
  const queryParams = new URLSearchParams();

  if (params?.per_page) queryParams.set('per_page', params.per_page.toString());
  if (params?.hide_empty !== undefined) queryParams.set('hide_empty', params.hide_empty.toString());

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchAPI<WPTag[]>(`/tags${query}`);
}

/**
 * Fetch a single tag by slug
 */
export async function getTagBySlug(slug: string): Promise<WPTag | null> {
  const tags = await fetchAPI<WPTag[]>(`/tags?slug=${slug}`);
  return tags.length > 0 ? tags[0] : null;
}

/**
 * Check if a post has a specific tag by slug
 */
export function postHasTag(post: WPPost, tags: WPTag[], tagSlug: string): boolean {
  const tag = tags.find((t) => t.slug === tagSlug);
  if (!tag) return false;
  return post.tags.includes(tag.id);
}

/**
 * Fetch a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<WPCategory | null> {
  const categories = await fetchAPI<WPCategory[]>(`/categories?slug=${slug}`);
  return categories.length > 0 ? categories[0] : null;
}

/**
 * Fetch posts by category slug
 * Convenience function that resolves category slug to ID and fetches posts
 */
export async function getPostsByCategorySlug(
  categorySlug: string,
  params?: {
    per_page?: number;
    page?: number;
    orderby?: string;
    order?: 'asc' | 'desc';
  }
): Promise<WPPost[]> {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) {
    console.warn(`Category "${categorySlug}" not found`);
    return [];
  }

  return getPosts({
    categories: [category.id],
    ...params,
  });
}

/**
 * Pagination result interface
 */
export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Fetch posts with pagination metadata
 * Returns posts along with total count and page info from WordPress headers
 */
export async function getPostsWithPagination(params?: {
  per_page?: number;
  page?: number;
  categories?: number[];
  tags?: number[];
  exclude?: number[];
  orderby?: string;
  order?: 'asc' | 'desc';
}): Promise<PaginatedResult<WPPost>> {
  const apiUrl = getApiUrl();
  const queryParams = new URLSearchParams();

  const perPage = params?.per_page || 12;
  const page = params?.page || 1;

  queryParams.set('per_page', perPage.toString());
  queryParams.set('page', page.toString());
  if (params?.categories?.length) queryParams.set('categories', params.categories.join(','));
  if (params?.tags?.length) queryParams.set('tags', params.tags.join(','));
  if (params?.exclude?.length) queryParams.set('exclude', params.exclude.join(','));
  if (params?.orderby) queryParams.set('orderby', params.orderby);
  if (params?.order) queryParams.set('order', params.order);
  queryParams.set('_embed', 'true');

  // Add cache-busting parameter
  const separator = '&';
  const url = `${apiUrl}/posts?${queryParams.toString()}${separator}_t=${Date.now()}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`WordPress API Error: ${response.status} ${response.statusText}`);
  }

  const posts = await response.json() as WPPost[];

  // Get pagination info from headers
  const totalItems = parseInt(response.headers.get('X-WP-Total') || '0', 10);
  const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);

  return {
    items: posts,
    totalItems,
    totalPages,
    currentPage: page,
  };
}

/**
 * Fetch posts by category slug with pagination
 */
export async function getPostsByCategorySlugWithPagination(
  categorySlug: string,
  params?: {
    per_page?: number;
    page?: number;
    orderby?: string;
    order?: 'asc' | 'desc';
  }
): Promise<PaginatedResult<WPPost> & { category: WPCategory | null }> {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) {
    return {
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      category: null,
    };
  }

  const result = await getPostsWithPagination({
    categories: [category.id],
    ...params,
  });

  return {
    ...result,
    category,
  };
}

/**
 * Fetch posts by tag slug with pagination
 */
export async function getPostsByTagSlugWithPagination(
  tagSlug: string,
  params?: {
    per_page?: number;
    page?: number;
    orderby?: string;
    order?: 'asc' | 'desc';
  }
): Promise<PaginatedResult<WPPost> & { tag: WPTag | null }> {
  const tag = await getTagBySlug(tagSlug);
  if (!tag) {
    return {
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      tag: null,
    };
  }

  const result = await getPostsWithPagination({
    tags: [tag.id],
    ...params,
  });

  return {
    ...result,
    tag,
  };
}

// =============================================================================
// Search
// =============================================================================

/**
 * Search Result Interface
 */
export interface SearchResult {
  id: number;
  type: 'post' | 'page' | 'service';
  title: string;
  excerpt: string;
  slug: string;
  url: string;
  image?: {
    url: string;
    alt: string;
  };
}

/**
 * Search across multiple content types using WordPress native search
 * Note: 'page' type searches both WordPress pages AND static Next.js pages
 */
export async function search(params: {
  query: string;
  types?: ('post' | 'page' | 'service')[];
  per_page?: number;
}): Promise<SearchResult[]> {
  const { query, types = ['post', 'page', 'service'], per_page = 10 } = params;

  if (!query.trim()) return [];

  // Import static page search dynamically to avoid circular deps
  const { searchStaticPages } = await import('./static-pages');

  // Search each content type in parallel
  const searches = types.map(async (type) => {
    const endpoint = type === 'post' ? 'posts' : type === 'page' ? 'pages' : 'services';
    try {
      const items = await fetchAPI<Array<{
        id: number;
        slug: string;
        title: { rendered: string };
        excerpt?: { rendered: string };
        content?: { rendered: string };
        _embedded?: {
          'wp:featuredmedia'?: Array<{
            source_url: string;
            alt_text: string;
            media_details?: {
              sizes?: {
                thumbnail?: { source_url: string };
                medium?: { source_url: string };
              };
            };
          }>;
        };
      }>>(`/${endpoint}?search=${encodeURIComponent(query)}&per_page=${per_page}&_embed=wp:featuredmedia`);

      const wpResults = items.map(item => {
        const featuredMedia = item._embedded?.['wp:featuredmedia']?.[0];
        const imageUrl = featuredMedia?.media_details?.sizes?.thumbnail?.source_url
          || featuredMedia?.media_details?.sizes?.medium?.source_url
          || featuredMedia?.source_url;

        // Use excerpt if available, otherwise extract from content
        const excerptText = item.excerpt?.rendered
          ? stripHtml(item.excerpt.rendered)
          : item.content?.rendered
            ? stripHtml(item.content.rendered).slice(0, 150)
            : '';

        return {
          id: item.id,
          type,
          title: decodeHtmlEntities(item.title.rendered),
          excerpt: excerptText.slice(0, 150),
          slug: item.slug,
          url: type === 'post' ? `/blog/${item.slug}`
             : type === 'page' ? `/${item.slug}`
             : `/services/${item.slug}`,
          image: imageUrl ? {
            url: imageUrl,
            alt: featuredMedia?.alt_text || '',
          } : undefined,
        };
      });

      // For 'page' type, also include static Next.js pages
      if (type === 'page') {
        const staticResults = searchStaticPages(query);
        return [...wpResults, ...staticResults];
      }

      return wpResults;
    } catch (error) {
      // If a content type fails (e.g., services CPT not registered), log and return empty
      console.error(`Search failed for ${type}:`, error);
      // Still return static pages for 'page' type even if WordPress fails
      if (type === 'page') {
        return searchStaticPages(query);
      }
      return [];
    }
  });

  const searchResults = await Promise.all(searches);
  return searchResults.flat();
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * URL mappings for development to production image rewrites
 * Configure via NEXT_PUBLIC_URL_REWRITES environment variable
 * Format: JSON object with local->production domain mappings
 * Example: {"http://local.site":"https://production.site"}
 */
function getUrlRewrites(): Record<string, string> {
  const envRewrites = process.env.NEXT_PUBLIC_URL_REWRITES;
  if (!envRewrites) return {};

  try {
    return JSON.parse(envRewrites);
  } catch {
    console.warn('Invalid NEXT_PUBLIC_URL_REWRITES format. Expected JSON object.');
    return {};
  }
}

/**
 * Rewrite image URLs from local/development domains to production
 * This handles cases where WordPress stores local URLs in the database
 */
export function rewriteImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  const rewrites = getUrlRewrites();
  for (const [localDomain, productionDomain] of Object.entries(rewrites)) {
    if (url.startsWith(localDomain)) {
      return url.replace(localDomain, productionDomain);
    }
  }

  return url;
}

/**
 * Rewrite all image URLs in HTML content
 */
export function rewriteContentUrls(html: string): string {
  let result = html;

  const rewrites = getUrlRewrites();
  for (const [localDomain, productionDomain] of Object.entries(rewrites)) {
    result = result.replaceAll(localDomain, productionDomain);
  }

  return result;
}

/**
 * Strip HTML tags from string (for excerpts, etc.)
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Decode HTML entities
 */
export function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&#8217;': "'",
    '&#8220;': '"',
    '&#8221;': '"',
    '&nbsp;': ' ',
  };

  return text.replace(/&[^;]+;/g, (entity) => entities[entity] || entity);
}

/**
 * Format WordPress date to readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get reading time estimate from content
 */
export function getReadingTime(content: string): number {
  const text = stripHtml(content);
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Get display category name for a post, skipping internal categories
 * Skips categories like "breaking-news" that are used for filtering, not display
 */
export function getDisplayCategoryName(
  post: WPPost,
  categories: WPCategory[],
  skipSlugs: string[] = ["breaking-news"]
): string {
  if (post.categories.length === 0) return "News";

  for (const categoryId of post.categories) {
    const category = categories.find((c) => c.id === categoryId);
    if (category && !skipSlugs.includes(category.slug)) {
      return category.name;
    }
  }

  return "News";
}

/**
 * Get author name from post's _embedded data
 * Falls back to author_name field or "Staff" if not available
 */
export function getPostAuthorName(post: WPPost): string {
  // Try _embedded author first (most reliable)
  const embeddedAuthor = post._embedded?.author?.[0];
  if (embeddedAuthor?.name) {
    return embeddedAuthor.name;
  }

  // Fall back to author_name field
  if (post.author_name) {
    return post.author_name;
  }

  return "Staff";
}

/**
 * Get author avatar URL from post's _embedded data
 * Returns the 48px avatar by default, or null if not available
 */
export function getPostAuthorAvatar(post: WPPost): string | null {
  const embeddedAuthor = post._embedded?.author?.[0];
  if (!embeddedAuthor?.avatar_urls) {
    return null;
  }

  // Prefer 48px, fall back to 96px or 24px
  return (
    embeddedAuthor.avatar_urls['48'] ||
    embeddedAuthor.avatar_urls['96'] ||
    embeddedAuthor.avatar_urls['24'] ||
    null
  );
}

/**
 * Get author bio from post's _embedded data
 * Returns the author description or empty string if not available
 */
export function getPostAuthorBio(post: WPPost): string {
  const embeddedAuthor = post._embedded?.author?.[0];
  return embeddedAuthor?.description || "";
}

/**
 * Get embedded categories from post's _embedded data
 * Returns array of category objects with id, name, and slug
 */
export function getPostCategories(post: WPPost): Array<{ id: number; name: string; slug: string }> {
  const terms = post._embedded?.['wp:term'];
  if (!terms) return [];

  // wp:term is an array of arrays, first array is categories, second is tags
  const categories = terms.flat().filter((term) => term.taxonomy === 'category');
  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
  }));
}

/**
 * Get embedded tags from post's _embedded data
 * Returns array of tag objects with id, name, and slug
 */
export function getPostTags(post: WPPost): Array<{ id: number; name: string; slug: string }> {
  const terms = post._embedded?.['wp:term'];
  if (!terms) return [];

  // wp:term is an array of arrays, first array is categories, second is tags
  const tags = terms.flat().filter((term) => term.taxonomy === 'post_tag');
  return tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
  }));
}
