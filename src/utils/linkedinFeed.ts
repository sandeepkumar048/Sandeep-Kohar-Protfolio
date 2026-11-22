export type LinkedInFeedStatus =
  | 'connected'
  | 'auth_required'
  | 'not_configured'
  | 'error';

export type LinkedInFeedSource = 'oauth' | 'token' | 'feed' | 'none';

export interface LinkedInPost {
  id: string;
  authorName: string;
  authorHeadline: string;
  authorUrl: string;
  publishedAt: string | null;
  displayDate: string;
  text: string;
  hashtags: string[];
  postUrl: string;
  imageUrl?: string;
  imageAlt?: string;
  likesCount?: number;
  commentsCount?: number;
}

export interface LinkedInFeedResponse {
  status: LinkedInFeedStatus;
  source: LinkedInFeedSource;
  oauthConfigured: boolean;
  connected: boolean;
  profileUrl: string;
  profileHandle: string;
  redirectUri: string;
  fetchedAt: string;
  message?: string;
  posts: LinkedInPost[];
}

export interface AuthorFallback {
  name: string;
  headline: string;
  profileUrl: string;
}

const DEFAULT_PROFILE_URL = 'https://www.linkedin.com/in/sandeepkohar/';

/**
 * Validates that a dynamic URL uses strictly https: (blocking javascript:, data:, file:, etc.).
 */
export function sanitizeExternalHttpsUrl(rawUrl?: string | null): string | undefined {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return undefined;
  }
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return undefined;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') {
      return undefined;
    }
    return parsed.toString();
  } catch {
    return undefined;
  }
}

function isPrivateOrLocalHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (
    host === 'localhost' ||
    host === '0.0.0.0' ||
    host === '::1' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host.endsWith('.internal')
  ) {
    return true;
  }

  // IPv4 private, loopback, link-local, and CGNAT ranges
  const ipv4Match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (ipv4Match) {
    const [a, b] = [Number(ipv4Match[1]), Number(ipv4Match[2])];
    if (a === 127 || a === 10 || a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
  }

  // IPv6 unique local / link-local
  if (host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe80:')) {
    return true;
  }

  return false;
}

/**
 * Guards server-side outbound feed fetches against SSRF (requires https: and public host).
 */
export function isSafeExternalFeedUrl(rawUrl?: string | null): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return false;
  }
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== 'https:') {
      return false;
    }
    if (parsed.username || parsed.password) {
      return false;
    }
    if (isPrivateOrLocalHost(parsed.hostname)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, (_match, dec: string) => {
      const code = Number.parseInt(dec, 10);
      return Number.isFinite(code) && code > 0 && code < 0x10ffff
        ? String.fromCodePoint(code)
        : '';
    })
    .replace(/&#x([0-9a-f]+);/gi, (_match, hex: string) => {
      const code = Number.parseInt(hex, 16);
      return Number.isFinite(code) && code > 0 && code < 0x10ffff
        ? String.fromCodePoint(code)
        : '';
    });
}

export function stripHtmlAndDecode(input: string): string {
  if (!input) {
    return '';
  }
  const withoutCdata = input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]*>/g, ' ');
  return decodeHtmlEntities(withoutCdata)
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

export function extractHashtags(text: string, maxCount = 4): string[] {
  const matches = text.match(/#[A-Za-z][A-Za-z0-9_]{1,36}/g) ?? [];
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const tag of matches) {
    const key = tag.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(tag);
      if (unique.length >= maxCount) {
        break;
      }
    }
  }
  return unique;
}

export function truncatePostText(
  text: string,
  maxLength = 220
): { excerpt: string; truncated: boolean } {
  const clean = text.trim();
  if (clean.length <= maxLength) {
    return { excerpt: clean, truncated: false };
  }
  const slice = clean.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(' ');
  const cutoff = lastSpace > maxLength * 0.6 ? slice.slice(0, lastSpace) : slice;
  return {
    excerpt: `${cutoff.replace(/[,.;:!\s]+$/, '')}…`,
    truncated: true,
  };
}

export function formatPostDate(isoOrTimestamp?: string | number | null): string {
  if (isoOrTimestamp === undefined || isoOrTimestamp === null || isoOrTimestamp === '') {
    return 'Recent update';
  }
  const date =
    typeof isoOrTimestamp === 'number'
      ? new Date(isoOrTimestamp)
      : new Date(isoOrTimestamp);
  if (Number.isNaN(date.getTime())) {
    return 'Recent update';
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function toIsoTimestamp(value?: string | number | null): string | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const date = typeof value === 'number' ? new Date(value) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function buildLinkedInPostPermalink(rawIdOrUrl: string | undefined, profileUrl: string): string {
  const direct = sanitizeExternalHttpsUrl(rawIdOrUrl);
  if (direct) {
    return direct;
  }
  if (rawIdOrUrl && rawIdOrUrl.startsWith('urn:li:')) {
    return `https://www.linkedin.com/feed/update/${encodeURIComponent(rawIdOrUrl)}/`;
  }
  return sanitizeExternalHttpsUrl(profileUrl) ?? DEFAULT_PROFILE_URL;
}

function sortAndLimitPosts(posts: LinkedInPost[], limit: number): LinkedInPost[] {
  return [...posts]
    .sort((a, b) => {
      const timeA = a.publishedAt ? Date.parse(a.publishedAt) : 0;
      const timeB = b.publishedAt ? Date.parse(b.publishedAt) : 0;
      return timeB - timeA;
    })
    .slice(0, Math.max(1, limit));
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function readOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : undefined;
}

/**
 * Parses LinkedIn REST Posts API (`/rest/posts`) responses into normalized LinkedInPost objects.
 */
export function parseLinkedInRestPosts(
  payload: unknown,
  authorFallback: AuthorFallback,
  limit = 3
): LinkedInPost[] {
  const root = asRecord(payload);
  const elements = Array.isArray(root?.elements) ? root.elements : [];
  const parsed: LinkedInPost[] = [];

  for (let i = 0; i < elements.length; i += 1) {
    const item = asRecord(elements[i]);
    if (!item) continue;

    const rawId = typeof item.id === 'string' ? item.id : `linkedin-rest-${i + 1}`;
    const commentary = typeof item.commentary === 'string' ? item.commentary : '';
    const content = asRecord(item.content);
    const article = asRecord(content?.article);
    const media = asRecord(content?.media);

    const articleTitle = typeof article?.title === 'string' ? article.title : '';
    const articleDesc = typeof article?.description === 'string' ? article.description : '';
    const mediaTitle = typeof media?.title === 'string' ? media.title : '';

    const combinedText = stripHtmlAndDecode(
      commentary || [articleTitle, articleDesc].filter(Boolean).join(' — ') || mediaTitle
    );
    if (!combinedText) continue;

    const createdAtRaw =
      typeof item.publishedAt === 'number'
        ? item.publishedAt
        : typeof item.createdAt === 'number'
          ? item.createdAt
          : typeof item.lastModifiedAt === 'number'
            ? item.lastModifiedAt
            : null;
    const publishedAt = toIsoTimestamp(createdAtRaw);

    const candidateImage =
      sanitizeExternalHttpsUrl(
        typeof article?.thumbnail === 'string' ? article.thumbnail : undefined
      ) ??
      sanitizeExternalHttpsUrl(
        typeof media?.thumbnail === 'string' ? media.thumbnail : undefined
      );

    parsed.push({
      id: rawId,
      authorName: authorFallback.name,
      authorHeadline: authorFallback.headline,
      authorUrl: sanitizeExternalHttpsUrl(authorFallback.profileUrl) ?? DEFAULT_PROFILE_URL,
      publishedAt,
      displayDate: formatPostDate(publishedAt),
      text: combinedText,
      hashtags: extractHashtags(combinedText),
      postUrl: buildLinkedInPostPermalink(rawId, authorFallback.profileUrl),
      imageUrl: candidateImage,
      imageAlt: mediaTitle || articleTitle || `${authorFallback.name} LinkedIn post media`,
    });
  }

  return sortAndLimitPosts(parsed, limit);
}

/**
 * Parses LinkedIn legacy UGC Posts API (`/v2/ugcPosts`) responses.
 */
export function parseLinkedInUgcPosts(
  payload: unknown,
  authorFallback: AuthorFallback,
  limit = 3
): LinkedInPost[] {
  const root = asRecord(payload);
  const elements = Array.isArray(root?.elements) ? root.elements : [];
  const parsed: LinkedInPost[] = [];

  for (let i = 0; i < elements.length; i += 1) {
    const item = asRecord(elements[i]);
    if (!item) continue;

    const rawId = typeof item.id === 'string' ? item.id : `linkedin-ugc-${i + 1}`;
    const specificContent = asRecord(item.specificContent);
    const shareContent = asRecord(specificContent?.['com.linkedin.ugc.ShareContent']);
    const shareCommentary = asRecord(shareContent?.shareCommentary);
    const text = stripHtmlAndDecode(
      typeof shareCommentary?.text === 'string' ? shareCommentary.text : ''
    );
    if (!text) continue;

    const created = asRecord(item.created);
    const publishedAt = toIsoTimestamp(
      typeof created?.time === 'number' ? created.time : null
    );

    const mediaList = Array.isArray(shareContent?.media) ? shareContent.media : [];
    const firstMedia = asRecord(mediaList[0]);
    const thumbnails = Array.isArray(firstMedia?.thumbnails) ? firstMedia.thumbnails : [];
    const firstThumb = asRecord(thumbnails[0]);
    const imageUrl = sanitizeExternalHttpsUrl(
      typeof firstThumb?.url === 'string' ? firstThumb.url : undefined
    );

    parsed.push({
      id: rawId,
      authorName: authorFallback.name,
      authorHeadline: authorFallback.headline,
      authorUrl: sanitizeExternalHttpsUrl(authorFallback.profileUrl) ?? DEFAULT_PROFILE_URL,
      publishedAt,
      displayDate: formatPostDate(publishedAt),
      text,
      hashtags: extractHashtags(text),
      postUrl: buildLinkedInPostPermalink(rawId, authorFallback.profileUrl),
      imageUrl,
      imageAlt: `${authorFallback.name} LinkedIn post media`,
    });
  }

  return sortAndLimitPosts(parsed, limit);
}

function readXmlTag(block: string, tagName: string): string | undefined {
  const regex = new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = regex.exec(block);
  return match?.[1]?.trim();
}

function readAtomLink(block: string): string | undefined {
  const hrefMatch = /<link[^>]+href=["']([^"']+)["'][^>]*>/i.exec(block);
  if (hrefMatch?.[1]) {
    return hrefMatch[1].trim();
  }
  return readXmlTag(block, 'link');
}

function readXmlImage(block: string): string | undefined {
  const enclosureMatch =
    /<(?:enclosure|media:content|media:thumbnail)[^>]+url=["']([^"']+)["'][^>]*>/i.exec(
      block
    );
  if (enclosureMatch?.[1]) {
    return sanitizeExternalHttpsUrl(decodeHtmlEntities(enclosureMatch[1]));
  }
  const imgMatch = /<img[^>]+src=["']([^"']+)["'][^>]*>/i.exec(block);
  if (imgMatch?.[1]) {
    return sanitizeExternalHttpsUrl(decodeHtmlEntities(imgMatch[1]));
  }
  return undefined;
}

/**
 * Parses external JSON Feed 1.1, generic JSON post feeds, RSS 2.0 XML, or Atom XML
 * configured via server-side `LINKEDIN_FEED_URL`.
 */
export function parseExternalFeedPayload(
  rawBody: string,
  contentType: string,
  authorFallback: AuthorFallback,
  limit = 3
): LinkedInPost[] {
  const trimmed = rawBody.trim();
  if (!trimmed) {
    return [];
  }

  const looksJson =
    contentType.toLowerCase().includes('json') ||
    trimmed.startsWith('{') ||
    trimmed.startsWith('[');

  if (looksJson) {
    try {
      const json = JSON.parse(trimmed) as unknown;
      const root = asRecord(json);
      const rawItems = Array.isArray(json)
        ? json
        : Array.isArray(root?.items)
          ? root.items
          : Array.isArray(root?.posts)
            ? root.posts
            : Array.isArray(root?.data)
              ? root.data
              : Array.isArray(root?.elements)
                ? root.elements
                : [];

      const parsed: LinkedInPost[] = [];
      for (let i = 0; i < rawItems.length; i += 1) {
        const entry = asRecord(rawItems[i]);
        if (!entry) continue;

        const textCandidate = [
          entry.content_text,
          entry.text,
          entry.commentary,
          entry.summary,
          entry.description,
          entry.content_html,
          entry.title,
        ].find((v): v is string => typeof v === 'string' && v.trim().length > 0);

        const cleanText = stripHtmlAndDecode(textCandidate ?? '');
        if (!cleanText) continue;

        const rawDate = [
          entry.date_published,
          entry.publishedAt,
          entry.published_at,
          entry.pubDate,
          entry.created_at,
          entry.createdAt,
        ].find((v): v is string | number => typeof v === 'string' || typeof v === 'number');

        const publishedAt = toIsoTimestamp(rawDate ?? null);
        const rawUrl = [entry.url, entry.postUrl, entry.link, entry.external_url].find(
          (v): v is string => typeof v === 'string' && v.trim().length > 0
        );
        const rawImg = [entry.image, entry.imageUrl, entry.banner_image, entry.thumbnail].find(
          (v): v is string => typeof v === 'string' && v.trim().length > 0
        );

        const authorObj = asRecord(entry.author);
        const authorName =
          typeof authorObj?.name === 'string' && authorObj.name.trim()
            ? authorObj.name.trim()
            : authorFallback.name;

        parsed.push({
          id:
            typeof entry.id === 'string' && entry.id.trim()
              ? entry.id.trim()
              : `linkedin-feed-${i + 1}`,
          authorName,
          authorHeadline: authorFallback.headline,
          authorUrl: sanitizeExternalHttpsUrl(authorFallback.profileUrl) ?? DEFAULT_PROFILE_URL,
          publishedAt,
          displayDate: formatPostDate(publishedAt),
          text: cleanText,
          hashtags: extractHashtags(cleanText),
          postUrl: buildLinkedInPostPermalink(rawUrl, authorFallback.profileUrl),
          imageUrl: sanitizeExternalHttpsUrl(rawImg),
          imageAlt: `${authorName} LinkedIn post image`,
          likesCount: readOptionalNumber(entry.likesCount ?? entry.likes),
          commentsCount: readOptionalNumber(entry.commentsCount ?? entry.comments),
        });
      }

      return sortAndLimitPosts(parsed, limit);
    } catch {
      return [];
    }
  }

  // RSS 2.0 (<item>) or Atom (<entry>) XML
  const itemMatches = [
    ...trimmed.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi),
    ...trimmed.matchAll(/<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/gi),
  ];

  const parsed: LinkedInPost[] = [];
  for (let i = 0; i < itemMatches.length; i += 1) {
    const block = itemMatches[i][1];
    const title = readXmlTag(block, 'title');
    const description =
      readXmlTag(block, 'content:encoded') ??
      readXmlTag(block, 'description') ??
      readXmlTag(block, 'summary') ??
      readXmlTag(block, 'content');

    const cleanDesc = stripHtmlAndDecode(description ?? '');
    const cleanTitle = stripHtmlAndDecode(title ?? '');
    const text =
      cleanDesc.length >= cleanTitle.length && cleanDesc.length > 0
        ? cleanDesc
        : cleanTitle;
    if (!text) continue;

    const rawDate =
      readXmlTag(block, 'pubDate') ??
      readXmlTag(block, 'published') ??
      readXmlTag(block, 'updated') ??
      readXmlTag(block, 'dc:date');
    const publishedAt = toIsoTimestamp(rawDate ?? null);
    const rawLink = readAtomLink(block);
    const guid = readXmlTag(block, 'guid') ?? readXmlTag(block, 'id');

    parsed.push({
      id: stripHtmlAndDecode(guid ?? '') || `linkedin-xml-${i + 1}`,
      authorName: authorFallback.name,
      authorHeadline: authorFallback.headline,
      authorUrl: sanitizeExternalHttpsUrl(authorFallback.profileUrl) ?? DEFAULT_PROFILE_URL,
      publishedAt,
      displayDate: formatPostDate(publishedAt),
      text,
      hashtags: extractHashtags(text),
      postUrl: buildLinkedInPostPermalink(
        rawLink ? decodeHtmlEntities(rawLink) : undefined,
        authorFallback.profileUrl
      ),
      imageUrl: readXmlImage(block),
      imageAlt: `${authorFallback.name} LinkedIn post image`,
    });
  }

  return sortAndLimitPosts(parsed, limit);
}
