import { useCallback, useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Linkedin,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { PERSONAL_PROFILE } from '../data/portfolioData';
import {
  sanitizeExternalHttpsUrl,
  truncatePostText,
  type LinkedInFeedResponse,
  type LinkedInPost,
} from '../utils/linkedinFeed';

function LinkedInPostCard({
  post,
  index,
}: {
  post: LinkedInPost;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const safePostUrl =
    sanitizeExternalHttpsUrl(post.postUrl) ?? PERSONAL_PROFILE.linkedinUrl;
  const safeImageUrl = !imageFailed
    ? sanitizeExternalHttpsUrl(post.imageUrl)
    : undefined;
  const { excerpt, truncated } = truncatePostText(post.text, 220);
  const visibleText = expanded ? post.text : excerpt;

  const hasEngagement =
    typeof post.likesCount === 'number' || typeof post.commentsCount === 'number';
  const engagementParts: string[] = [];
  if (typeof post.likesCount === 'number') {
    engagementParts.push(
      `${post.likesCount} ${post.likesCount === 1 ? 'reaction' : 'reactions'}`
    );
  }
  if (typeof post.commentsCount === 'number') {
    engagementParts.push(
      `${post.commentsCount} ${post.commentsCount === 1 ? 'comment' : 'comments'}`
    );
  }

  return (
    <article className="flex h-full flex-col justify-between rounded-[22px] border border-neutral-200/90 bg-white p-6 shadow-[0_16px_38px_-26px_rgba(17,17,17,0.16)] transition-all duration-200 hover:border-[#111111]/40 hover:shadow-[0_22px_48px_-26px_rgba(17,17,17,0.22)]">
      <div>
        {/* Top Metadata Row (Zero-pill unboxed typography) */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#111111] text-[#D9FA7A]">
              <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <p className="truncate text-[12px] font-medium text-[#525252] tabular-nums">
              <span>Post 0{index + 1}</span>
              <span aria-hidden="true"> · </span>
              <time dateTime={post.publishedAt ?? undefined}>{post.displayDate}</time>
            </p>
          </div>
          <a
            href={safePostUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open LinkedIn post ${index + 1} on LinkedIn`}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-[#525252] transition-colors hover:border-[#111111] hover:bg-[#111111] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        {/* Author line */}
        <div className="mt-4">
          <p className="text-[14.5px] font-semibold tracking-[-0.01em] text-[#111111]">
            {post.authorName}
          </p>
          <p className="text-[12.5px] text-[#666666]">{post.authorHeadline}</p>
        </div>

        {/* Optional Post Media */}
        {safeImageUrl && (
          <div className="mt-4 overflow-hidden rounded-[14px] border border-neutral-200/80 bg-[#FAFAFA]">
            <img
              src={safeImageUrl}
              alt={post.imageAlt || `${post.authorName} LinkedIn post media`}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
        )}

        {/* Post Copy */}
        <p className="mt-4 whitespace-pre-line text-[14px] leading-[1.68] text-[#262626]">
          {visibleText}
        </p>

        {truncated && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-2 inline-flex min-h-[36px] items-center text-[13px] font-medium text-[#111111] underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-[#111111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
          >
            {expanded ? 'Show less' : 'Read full post'}
          </button>
        )}
      </div>

      {/* Footer Metadata & External Action */}
      <div className="mt-5 border-t border-neutral-100 pt-4">
        {post.hashtags.length > 0 && (
          <p className="mb-3 text-[12px] font-medium text-[#666666]">
            {post.hashtags.join(' · ')}
          </p>
        )}

        <div className="flex items-center justify-between gap-3">
          {hasEngagement ? (
            <p className="text-[12px] font-medium text-[#737373] tabular-nums">
              {engagementParts.join(' · ')}
            </p>
          ) : (
            <p className="text-[12px] font-medium text-[#737373]">LinkedIn Feed</p>
          )}

          <a
            href={safePostUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[38px] items-center gap-1.5 text-[13px] font-semibold text-[#111111] whitespace-nowrap shrink-0 transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
          >
            <span>Read on LinkedIn</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function LinkedInPostsSection() {
  const [feed, setFeed] = useState<LinkedInFeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const loadFeed = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setActionNotice(null);

    try {
      const endpoint = forceRefresh
        ? '/api/linkedin/posts?refresh=1'
        : '/api/linkedin/posts';
      const response = await fetch(endpoint, {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`Feed request failed (HTTP ${response.status}).`);
      }
      const data = (await response.json()) as LinkedInFeedResponse;
      setFeed(data);
    } catch (error) {
      const fallbackRedirect =
        typeof window !== 'undefined'
          ? `${window.location.origin}/auth/linkedin/callback`
          : '/auth/linkedin/callback';
      setFeed({
        status: 'error',
        source: 'none',
        oauthConfigured: false,
        connected: false,
        profileUrl: PERSONAL_PROFILE.linkedinUrl,
        profileHandle: PERSONAL_PROFILE.linkedinLabel,
        redirectUri: fallbackRedirect,
        fetchedAt: new Date().toISOString(),
        message:
          error instanceof Error
            ? error.message
            : 'Unable to reach the LinkedIn feed service.',
        posts: [],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadFeed(false);
  }, [loadFeed]);

  // Listen for OAuth popup completion messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      const isAllowedOrigin =
        origin === window.location.origin ||
        origin.endsWith('.run.app') ||
        origin.includes('localhost');
      if (!isAllowedOrigin) {
        return;
      }
      if (event.data?.type === 'LINKEDIN_OAUTH_SUCCESS') {
        setConnecting(false);
        setActionNotice('LinkedIn connected — fetching your latest 3 posts.');
        void loadFeed(true);
      } else if (event.data?.type === 'LINKEDIN_OAUTH_ERROR') {
        setConnecting(false);
        const errText =
          typeof event.data?.error === 'string' && event.data.error.trim()
            ? event.data.error
            : 'LinkedIn authorization was cancelled or declined.';
        setActionNotice(errText);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [loadFeed]);

  const handleConnectLinkedIn = async () => {
    setConnecting(true);
    setActionNotice(null);
    try {
      const response = await fetch('/api/linkedin/auth-url', {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        setActionNotice(
          data.error ||
            'LinkedIn OAuth credentials are not configured on the server yet.'
        );
        setConnecting(false);
        return;
      }

      const authWindow = window.open(
        data.url,
        'linkedin_oauth_popup',
        'width=600,height=720,noopener=no'
      );
      if (!authWindow) {
        setActionNotice(
          'Your browser blocked the LinkedIn sign-in popup. Please allow popups for this site and try again.'
        );
        setConnecting(false);
      }
    } catch {
      setActionNotice('Unable to start LinkedIn sign-in right now. Please try again.');
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    setActionNotice(null);
    try {
      await fetch('/api/linkedin/disconnect', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      await loadFeed(true);
    } catch {
      setActionNotice('Unable to disconnect LinkedIn session right now.');
    } finally {
      setDisconnecting(false);
    }
  };

  const posts = feed?.posts.slice(0, 3) ?? [];
  const hasPosts = feed?.status === 'connected' && posts.length > 0;
  const profileUrl =
    sanitizeExternalHttpsUrl(feed?.profileUrl) ?? PERSONAL_PROFILE.linkedinUrl;

  return (
    <section
      id="linkedin-posts"
      aria-labelledby="linkedin-posts-heading"
      className="scroll-mt-20 border-t border-neutral-100 bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1140px] px-6 md:px-10">
        {/* Centered Editorial Section Header */}
        <div className="text-center">
          <p className="font-serif italic text-[18px] text-[#525252]">
            Professional Journal
          </p>
          <h2
            id="linkedin-posts-heading"
            className="mt-2 font-sans text-[clamp(2.1rem,4.4vw,3.45rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[#111111]"
          >
            Latest on{' '}
            <span className="font-serif italic font-normal">LinkedIn</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[580px] text-[15px] leading-[1.6] text-[#525252]">
            Fresh updates fetched live from Sandeep Kohar’s LinkedIn profile — web
            engineering builds, graphic design launches, and campus leadership.
          </p>
        </div>

        {/* Clean Single-Line Action Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {feed?.oauthConfigured && !feed.connected && (
            <button
              type="button"
              onClick={handleConnectLinkedIn}
              disabled={connecting}
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-[#111111] px-5 py-2 text-[13.5px] font-medium text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#262626] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
            >
              <Linkedin className="h-4 w-4 text-[#D9FA7A]" aria-hidden="true" />
              <span>{connecting ? 'Waiting for LinkedIn…' : 'Connect LinkedIn'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => void loadFeed(true)}
            disabled={loading || refreshing}
            className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13.5px] font-medium text-[#111111] whitespace-nowrap shrink-0 transition-colors hover:border-[#111111] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            <span>{refreshing ? 'Refreshing…' : 'Refresh Feed'}</span>
          </button>

          {feed?.connected && feed.source === 'oauth' && (
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13.5px] font-medium text-[#525252] whitespace-nowrap shrink-0 transition-colors hover:border-[#111111] hover:text-[#111111] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{disconnecting ? 'Disconnecting…' : 'Disconnect'}</span>
            </button>
          )}

          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13.5px] font-medium text-[#525252] whitespace-nowrap shrink-0 transition-colors hover:border-[#111111] hover:text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
          >
            <span>View Profile</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        {/* Inline Notice (OAuth feedback / popup notice) */}
        {actionNotice && (
          <div
            role="status"
            aria-live="polite"
            className="mx-auto mt-6 max-w-[680px] rounded-[16px] border border-neutral-200 bg-[#FAFAFA] px-5 py-3.5 text-center text-[13.5px] text-[#262626]"
          >
            {actionNotice}
          </div>
        )}

        {/* Content Area */}
        <div className="mt-12">
          {loading ? (
            /* 3-Column Editorial Skeleton Cards */
            <div
              aria-busy="true"
              aria-label="Loading latest LinkedIn posts"
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {[0, 1, 2].map((slot) => (
                <div
                  key={slot}
                  className="flex h-[320px] flex-col justify-between rounded-[22px] border border-neutral-200/80 bg-[#FAFAFA] p-6"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-32 rounded bg-neutral-200/80" />
                      <div className="h-8 w-8 rounded-full bg-neutral-200/80" />
                    </div>
                    <div className="mt-5 h-4 w-36 rounded bg-neutral-200/80" />
                    <div className="mt-2 h-3 w-48 rounded bg-neutral-200/60" />
                    <div className="mt-6 space-y-2.5">
                      <div className="h-3.5 w-full rounded bg-neutral-200/70" />
                      <div className="h-3.5 w-11/12 rounded bg-neutral-200/70" />
                      <div className="h-3.5 w-4/5 rounded bg-neutral-200/70" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-neutral-200/70 pt-4">
                    <div className="h-3 w-24 rounded bg-neutral-200/70" />
                    <div className="h-3 w-28 rounded bg-neutral-200/80" />
                  </div>
                </div>
              ))}
            </div>
          ) : hasPosts ? (
            /* Live 3-Column LinkedIn Post Cards */
            <div
              data-testid="linkedin-posts-grid"
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {posts.map((post, index) => (
                <LinkedInPostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          ) : feed?.status === 'connected' && posts.length === 0 ? (
            /* Connected but 0 public posts returned */
            <div className="mx-auto max-w-[680px] rounded-[24px] border border-neutral-200/90 bg-[#FAFAFA] p-8 text-center">
              <div className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#111111] text-[#D9FA7A]">
                <Linkedin className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-sans text-[20px] font-semibold tracking-[-0.02em] text-[#111111]">
                Connected — No Recent Posts Returned Yet
              </h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-[#525252]">
                Your LinkedIn connection is active, and no public posts were returned for this
                account yet. Publish a new post on LinkedIn and select Refresh Feed.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => void loadFeed(true)}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#111111] px-5 py-2 text-[13.5px] font-medium text-white transition-colors hover:bg-[#262626] cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Check Again</span>
                </button>
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-5 py-2 text-[13.5px] font-medium text-[#111111] transition-colors hover:border-[#111111]"
                >
                  <span>Open LinkedIn Profile</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          ) : (
            /* Clean Centered LinkedIn Profile Card (auth_required, not_configured, or error) */
            <div className="mx-auto max-w-[640px] rounded-[24px] border border-neutral-200/90 bg-[#FAFAFA] p-7 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#111111] text-[#D9FA7A]">
                  <Linkedin className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-[12px] font-medium text-[#666666]">
                  LinkedIn Profile · Top 3 Posts
                </span>
              </div>

              <h3 className="mt-5 font-sans text-[22px] font-semibold tracking-[-0.02em] text-[#111111]">
                {PERSONAL_PROFILE.name}
              </h3>
              <p className="mt-1 text-[13.5px] text-[#525252]">
                {PERSONAL_PROFILE.title} · {PERSONAL_PROFILE.currentLocation}
              </p>
              <p className="mt-4 text-[14px] leading-[1.65] text-[#404040]">
                {feed?.status === 'error'
                  ? feed.message
                  : feed?.status === 'auth_required'
                    ? 'Authorize your LinkedIn account to load your latest 3 posts directly into this section.'
                    : 'Follow Sandeep Kohar on LinkedIn for recent web development launches, graphic design campaigns, and engineering community updates.'}
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200/80 pt-5">
                {feed?.oauthConfigured ? (
                  <button
                    type="button"
                    onClick={handleConnectLinkedIn}
                    disabled={connecting}
                    className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-[#111111] px-5 py-2 text-[13.5px] font-medium text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#262626] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] cursor-pointer"
                  >
                    <Linkedin className="h-4 w-4 text-[#D9FA7A]" aria-hidden="true" />
                    <span>
                      {connecting ? 'Connecting…' : 'Connect LinkedIn Account'}
                    </span>
                  </button>
                ) : (
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full bg-[#111111] px-5 py-2 text-[13.5px] font-medium text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#262626] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
                  >
                    <span>Visit LinkedIn Profile</span>
                    <ArrowUpRight className="h-4 w-4 text-[#D9FA7A]" aria-hidden="true" />
                  </a>
                )}

                <span className="text-[12.5px] font-medium text-[#666666]">
                  {PERSONAL_PROFILE.linkedinLabel}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
