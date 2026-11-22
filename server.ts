import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import type { Request, Response } from 'express';
import {
  isSafeExternalFeedUrl,
  parseExternalFeedPayload,
  parseLinkedInRestPosts,
  parseLinkedInUgcPosts,
  type AuthorFallback,
  type LinkedInFeedResponse,
  type LinkedInPost,
} from './src/utils/linkedinFeed.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const LINKEDIN_PROFILE_URL = 'https://www.linkedin.com/in/sandeepkohar/';
const LINKEDIN_PROFILE_HANDLE = 'linkedin.com/in/sandeepkohar';
const LINKEDIN_API_VERSION = '202504';
const SESSION_COOKIE_NAME = 'sk_linkedin_sid';
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const FEED_CACHE_TTL_MS = 2 * 60 * 1000;

const DEFAULT_AUTHOR: AuthorFallback = {
  name: 'Sandeep Kohar',
  headline: 'Web Developer & Graphics Designer',
  profileUrl: LINKEDIN_PROFILE_URL,
};

interface OAuthStateRecord {
  createdAt: number;
  redirectUri: string;
}

interface LinkedInSession {
  accessToken: string;
  personUrn: string;
  authorName: string;
  expiresAt: number;
}

interface CachedFeed {
  posts: LinkedInPost[];
  fetchedAt: string;
  expiresAt: number;
  source: LinkedInFeedResponse['source'];
}

const pendingOAuthStates = new Map<string, OAuthStateRecord>();
const linkedInSessions = new Map<string, LinkedInSession>();
const feedCache = new Map<string, CachedFeed>();

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getAppOrigin(): string {
  const configured = process.env.APP_URL?.trim();
  if (configured && configured !== 'MY_APP_URL') {
    return configured.replace(/\/+$/, '');
  }
  return `http://localhost:${PORT}`;
}

function getLinkedInRedirectUri(): string {
  return `${getAppOrigin()}/auth/linkedin/callback`;
}

function isOAuthConfigured(): boolean {
  return Boolean(
    process.env.LINKEDIN_CLIENT_ID?.trim() && process.env.LINKEDIN_CLIENT_SECRET?.trim()
  );
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) {
    return {};
  }
  const cookies: Record<string, string> = {};
  for (const part of cookieHeader.split(';')) {
    const eqIndex = part.indexOf('=');
    if (eqIndex <= 0) continue;
    const key = part.slice(0, eqIndex).trim();
    const val = part.slice(eqIndex + 1).trim();
    if (key) {
      cookies[key] = decodeURIComponent(val);
    }
  }
  return cookies;
}

function setSessionCookie(res: Response, sessionId: string, maxAgeSeconds: number): void {
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(sessionId)}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; Secure; SameSite=None; Partitioned`
  );
}

function clearSessionCookie(res: Response): void {
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=None; Partitioned`
  );
}

function cleanupExpiredRecords(): void {
  const now = Date.now();
  for (const [state, record] of pendingOAuthStates.entries()) {
    if (now - record.createdAt > OAUTH_STATE_TTL_MS) {
      pendingOAuthStates.delete(state);
    }
  }
  for (const [sid, session] of linkedInSessions.entries()) {
    if (now >= session.expiresAt) {
      linkedInSessions.delete(sid);
    }
  }
  for (const [cacheKey, entry] of feedCache.entries()) {
    if (now >= entry.expiresAt) {
      feedCache.delete(cacheKey);
    }
  }
}

function getActiveSession(req: Request): { sessionId: string; session: LinkedInSession } | null {
  cleanupExpiredRecords();
  const cookies = parseCookies(req.headers.cookie);
  const sessionId = cookies[SESSION_COOKIE_NAME];
  if (!sessionId) {
    return null;
  }
  const session = linkedInSessions.get(sessionId);
  if (!session || Date.now() >= session.expiresAt) {
    linkedInSessions.delete(sessionId);
    return null;
  }
  return { sessionId, session };
}

async function resolveLinkedInMember(
  accessToken: string
): Promise<{ personUrn: string; authorName: string }> {
  const configuredUrn = process.env.LINKEDIN_PERSON_URN?.trim();

  // Primary OpenID Connect userinfo endpoint
  const userInfoRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(10000),
  });

  if (userInfoRes.ok) {
    const info = (await userInfoRes.json()) as {
      sub?: string;
      name?: string;
      given_name?: string;
      family_name?: string;
    };
    const sub = typeof info.sub === 'string' && info.sub.trim() ? info.sub.trim() : '';
    const authorName =
      info.name?.trim() ||
      [info.given_name, info.family_name].filter(Boolean).join(' ').trim() ||
      DEFAULT_AUTHOR.name;
    if (sub) {
      return {
        personUrn: sub.startsWith('urn:li:') ? sub : `urn:li:person:${sub}`,
        authorName,
      };
    }
  }

  // Fallback to v2/me for legacy r_liteprofile tokens
  const meRes = await fetch('https://api.linkedin.com/v2/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(10000),
  });

  if (meRes.ok) {
    const me = (await meRes.json()) as {
      id?: string;
      localizedFirstName?: string;
      localizedLastName?: string;
    };
    const authorName =
      [me.localizedFirstName, me.localizedLastName].filter(Boolean).join(' ').trim() ||
      DEFAULT_AUTHOR.name;
    if (me.id) {
      return {
        personUrn: `urn:li:person:${me.id}`,
        authorName,
      };
    }
  }

  if (configuredUrn) {
    return {
      personUrn: configuredUrn.startsWith('urn:li:')
        ? configuredUrn
        : `urn:li:person:${configuredUrn}`,
      authorName: DEFAULT_AUTHOR.name,
    };
  }

  throw new Error('Could not resolve LinkedIn member profile from access token.');
}

async function fetchPostsFromLinkedInApi(
  accessToken: string,
  personUrn: string,
  authorName: string
): Promise<LinkedInPost[]> {
  const authorFallback: AuthorFallback = {
    name: authorName || DEFAULT_AUTHOR.name,
    headline: DEFAULT_AUTHOR.headline,
    profileUrl: LINKEDIN_PROFILE_URL,
  };

  // LinkedIn REST Posts API
  const encodedAuthor = encodeURIComponent(personUrn);
  const restUrl = `https://api.linkedin.com/rest/posts?author=${encodedAuthor}&q=author&count=3&sortBy=LAST_MODIFIED`;
  const restRes = await fetch(restUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'LinkedIn-Version': LINKEDIN_API_VERSION,
      'X-Restli-Protocol-Version': '2.0.0',
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(12000),
  });

  if (restRes.ok) {
    const payload = (await restRes.json()) as unknown;
    return parseLinkedInRestPosts(payload, authorFallback, 3);
  }

  // Fallback to LinkedIn v2 UGC Posts API
  const ugcUrl = `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(${encodedAuthor})&count=3`;
  const ugcRes = await fetch(ugcUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-Restli-Protocol-Version': '2.0.0',
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(12000),
  });

  if (ugcRes.ok) {
    const payload = (await ugcRes.json()) as unknown;
    return parseLinkedInUgcPosts(payload, authorFallback, 3);
  }

  const statusCode = restRes.status;
  if (statusCode === 401) {
    throw new Error('LinkedIn authorization expired. Please reconnect your LinkedIn account.');
  }
  if (statusCode === 403) {
    throw new Error(
      'LinkedIn denied post read access (HTTP 403). Ensure your LinkedIn app has the r_member_social scope enabled, or configure LINKEDIN_FEED_URL.'
    );
  }
  throw new Error(`LinkedIn API returned HTTP ${statusCode} while fetching recent posts.`);
}

async function fetchPostsFromConfiguredFeed(feedUrl: string): Promise<LinkedInPost[]> {
  if (!isSafeExternalFeedUrl(feedUrl)) {
    throw new Error(
      'Configured LINKEDIN_FEED_URL must be a public HTTPS URL (private or local addresses are blocked).'
    );
  }

  const response = await fetch(feedUrl, {
    headers: {
      Accept: 'application/json, application/rss+xml, application/atom+xml, application/xml, text/xml',
      'User-Agent': 'SandeepKoharPortfolio/1.0 (+https://www.linkedin.com/in/sandeepkohar/)',
    },
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    throw new Error(`Configured LinkedIn feed returned HTTP ${response.status}.`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  const body = await response.text();
  return parseExternalFeedPayload(body, contentType, DEFAULT_AUTHOR, 3);
}

function renderOAuthCallbackHtml(success: boolean, errorMessage?: string): string {
  const safeError = errorMessage ?? 'LinkedIn authorization could not be completed.';
  const payload = JSON.stringify(
    success
      ? { type: 'LINKEDIN_OAUTH_SUCCESS' }
      : { type: 'LINKEDIN_OAUTH_ERROR', error: safeError }
  )
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  const safeText = success
    ? 'LinkedIn connected successfully. Returning to the portfolio...'
    : escapeHtml(safeError);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>LinkedIn Connection — Sandeep Kohar</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 0; min-height: 100vh; display: grid; place-items: center; background: #ffffff; color: #111111; padding: 24px; }
      .card { max-width: 420px; border: 1px solid #e5e5e5; border-radius: 18px; padding: 24px; text-align: center; }
      p { color: #525252; font-size: 14px; line-height: 1.6; }
    </style>
  </head>
  <body>
    <div class="card">
      <p>${safeText}</p>
    </div>
    <script>
      (function () {
        var msg = ${payload};
        if (window.opener) {
          window.opener.postMessage(msg, '*');
          window.close();
        } else {
          window.location.href = '/#linkedin-posts';
        }
      })();
    </script>
  </body>
</html>`;
}

function isSameOriginMutation(req: Request): boolean {
  const requestedWith = req.headers['x-requested-with'];
  if (requestedWith === 'XMLHttpRequest') {
    return true;
  }
  const origin = req.headers.origin;
  const host = (req.headers['x-forwarded-host'] as string | undefined) || req.headers.host;
  if (!origin || !host) {
    return false;
  }
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

async function createServer() {
  const app = express();
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(express.json({ limit: '64kb' }));

  // Step 1: Return LinkedIn OAuth 2.0 authorization URL for popup flow
  app.get('/api/linkedin/auth-url', (_req: Request, res: Response) => {
    cleanupExpiredRecords();
    const clientId = process.env.LINKEDIN_CLIENT_ID?.trim();
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET?.trim();
    const redirectUri = getLinkedInRedirectUri();

    if (!clientId || !clientSecret) {
      res.status(503).json({
        error:
          'LinkedIn OAuth credentials are not configured yet. Add LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET in environment secrets.',
        redirectUri,
      });
      return;
    }

    const state = crypto.randomBytes(24).toString('hex');
    pendingOAuthStates.set(state, {
      createdAt: Date.now(),
      redirectUri,
    });

    const scope =
      process.env.LINKEDIN_OAUTH_SCOPES?.trim() || 'openid profile r_member_social';

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      state,
      scope,
    });

    res.setHeader('Cache-Control', 'no-store');
    res.json({
      url: `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`,
      redirectUri,
    });
  });

  // Step 2: OAuth callback handler (handles both with and without trailing slash)
  const handleLinkedInCallback = async (req: Request, res: Response) => {
    cleanupExpiredRecords();
    const oauthError = typeof req.query.error === 'string' ? req.query.error.trim() : undefined;

    if (oauthError) {
      const errorMap: Record<string, string> = {
        user_cancelled_login: 'LinkedIn sign-in was cancelled.',
        user_cancelled_authorize: 'LinkedIn authorization was cancelled.',
        unauthorized_scope_error:
          'Your LinkedIn app is missing required permissions (openid, profile, or r_member_social).',
        access_denied: 'LinkedIn access was declined.',
      };
      res
        .status(400)
        .type('html')
        .send(
          renderOAuthCallbackHtml(
            false,
            errorMap[oauthError] ?? 'LinkedIn declined the authorization request.'
          )
        );
      return;
    }

    const code = typeof req.query.code === 'string' ? req.query.code.trim() : '';
    const state = typeof req.query.state === 'string' ? req.query.state.trim() : '';
    const stateRecord = state ? pendingOAuthStates.get(state) : undefined;

    if (!code || !stateRecord) {
      res
        .status(400)
        .type('html')
        .send(
          renderOAuthCallbackHtml(
            false,
            'Invalid or expired LinkedIn OAuth state. Please try connecting again.'
          )
        );
      return;
    }

    pendingOAuthStates.delete(state);

    const clientId = process.env.LINKEDIN_CLIENT_ID?.trim();
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET?.trim();
    if (!clientId || !clientSecret) {
      res
        .status(503)
        .type('html')
        .send(renderOAuthCallbackHtml(false, 'LinkedIn OAuth server secrets are missing.'));
      return;
    }

    try {
      const tokenBody = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: stateRecord.redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      });

      const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: tokenBody.toString(),
        signal: AbortSignal.timeout(12000),
      });

      if (!tokenRes.ok) {
        throw new Error(`LinkedIn token exchange failed (HTTP ${tokenRes.status}).`);
      }

      const tokenJson = (await tokenRes.json()) as {
        access_token?: string;
        expires_in?: number;
      };

      if (!tokenJson.access_token) {
        throw new Error('LinkedIn did not return an access token.');
      }

      const member = await resolveLinkedInMember(tokenJson.access_token);
      const ttlSeconds = Math.min(
        Math.max(Number(tokenJson.expires_in) || 3600, 300),
        Math.floor(SESSION_TTL_MS / 1000)
      );
      const sessionId = crypto.randomBytes(32).toString('hex');

      linkedInSessions.set(sessionId, {
        accessToken: tokenJson.access_token,
        personUrn: member.personUrn,
        authorName: member.authorName,
        expiresAt: Date.now() + ttlSeconds * 1000,
      });

      setSessionCookie(res, sessionId, ttlSeconds);
      res.setHeader('Cache-Control', 'no-store');
      res.status(200).type('html').send(renderOAuthCallbackHtml(true));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'LinkedIn authorization failed unexpectedly.';
      res.status(500).type('html').send(renderOAuthCallbackHtml(false, message));
    }
  };

  app.get(['/auth/linkedin/callback', '/auth/linkedin/callback/'], handleLinkedInCallback);

  // Step 3: Fetch latest 3 LinkedIn posts via real OAuth session, server token, or HTTPS feed URL
  app.get('/api/linkedin/posts', async (req: Request, res: Response) => {
    cleanupExpiredRecords();
    const forceRefresh = req.query.refresh === '1';
    const oauthConfigured = isOAuthConfigured();
    const redirectUri = getLinkedInRedirectUri();
    const activeSession = getActiveSession(req);
    const serverToken = process.env.LINKEDIN_ACCESS_TOKEN?.trim();
    const configuredFeedUrl = process.env.LINKEDIN_FEED_URL?.trim();

    res.setHeader('Cache-Control', 'no-store');

    const buildBase = (
      overrides: Partial<LinkedInFeedResponse>
    ): LinkedInFeedResponse => ({
      status: 'not_configured',
      source: 'none',
      oauthConfigured,
      connected: false,
      profileUrl: LINKEDIN_PROFILE_URL,
      profileHandle: LINKEDIN_PROFILE_HANDLE,
      redirectUri,
      fetchedAt: new Date().toISOString(),
      posts: [],
      ...overrides,
    });

    try {
      // Priority 1: Authenticated LinkedIn OAuth 2.0 session
      if (activeSession) {
        const cacheKey = `oauth:${activeSession.sessionId}`;
        const cached = !forceRefresh ? feedCache.get(cacheKey) : undefined;
        if (cached && Date.now() < cached.expiresAt) {
          res.json(
            buildBase({
              status: 'connected',
              source: 'oauth',
              connected: true,
              fetchedAt: cached.fetchedAt,
              posts: cached.posts,
            })
          );
          return;
        }

        const posts = await fetchPostsFromLinkedInApi(
          activeSession.session.accessToken,
          activeSession.session.personUrn,
          activeSession.session.authorName
        );
        const fetchedAt = new Date().toISOString();
        feedCache.set(cacheKey, {
          posts,
          fetchedAt,
          expiresAt: Date.now() + FEED_CACHE_TTL_MS,
          source: 'oauth',
        });

        res.json(
          buildBase({
            status: 'connected',
            source: 'oauth',
            connected: true,
            fetchedAt,
            posts,
          })
        );
        return;
      }

      // Priority 2: Server-side LinkedIn access token configured in environment secrets
      if (serverToken) {
        const cacheKey = 'env:token';
        const cached = !forceRefresh ? feedCache.get(cacheKey) : undefined;
        if (cached && Date.now() < cached.expiresAt) {
          res.json(
            buildBase({
              status: 'connected',
              source: 'token',
              connected: true,
              fetchedAt: cached.fetchedAt,
              posts: cached.posts,
            })
          );
          return;
        }

        const member = await resolveLinkedInMember(serverToken);
        const posts = await fetchPostsFromLinkedInApi(
          serverToken,
          member.personUrn,
          member.authorName
        );
        const fetchedAt = new Date().toISOString();
        feedCache.set(cacheKey, {
          posts,
          fetchedAt,
          expiresAt: Date.now() + FEED_CACHE_TTL_MS,
          source: 'token',
        });

        res.json(
          buildBase({
            status: 'connected',
            source: 'token',
            connected: true,
            fetchedAt,
            posts,
          })
        );
        return;
      }

      // Priority 3: Server-side public HTTPS RSS/JSON feed URL configured in secrets
      if (configuredFeedUrl) {
        const cacheKey = 'env:feed';
        const cached = !forceRefresh ? feedCache.get(cacheKey) : undefined;
        if (cached && Date.now() < cached.expiresAt) {
          res.json(
            buildBase({
              status: 'connected',
              source: 'feed',
              connected: true,
              fetchedAt: cached.fetchedAt,
              posts: cached.posts,
            })
          );
          return;
        }

        const posts = await fetchPostsFromConfiguredFeed(configuredFeedUrl);
        const fetchedAt = new Date().toISOString();
        feedCache.set(cacheKey, {
          posts,
          fetchedAt,
          expiresAt: Date.now() + FEED_CACHE_TTL_MS,
          source: 'feed',
        });

        res.json(
          buildBase({
            status: 'connected',
            source: 'feed',
            connected: true,
            fetchedAt,
            posts,
          })
        );
        return;
      }

      // OAuth credentials are ready, waiting for the user to sign in via popup
      if (oauthConfigured) {
        res.json(
          buildBase({
            status: 'auth_required',
            source: 'none',
            connected: false,
            message:
              'Connect your LinkedIn account to load your latest 3 posts directly from the LinkedIn API.',
          })
        );
        return;
      }

      // No credentials configured yet
      res.json(
        buildBase({
          status: 'not_configured',
          source: 'none',
          connected: false,
          message:
            'Add your LinkedIn OAuth credentials (LINKEDIN_CLIENT_ID & LINKEDIN_CLIENT_SECRET), a server token (LINKEDIN_ACCESS_TOKEN), or a live feed URL (LINKEDIN_FEED_URL) in environment secrets to sync posts automatically.',
        })
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to fetch recent LinkedIn posts right now.';
      res.json(
        buildBase({
          status: 'error',
          source: activeSession ? 'oauth' : serverToken ? 'token' : configuredFeedUrl ? 'feed' : 'none',
          connected: Boolean(activeSession),
          message,
        })
      );
    }
  });

  // Step 4: Disconnect OAuth session
  app.post('/api/linkedin/disconnect', (req: Request, res: Response) => {
    if (!isSameOriginMutation(req)) {
      res.status(403).json({ error: 'Forbidden cross-origin request.' });
      return;
    }
    const activeSession = getActiveSession(req);
    if (activeSession) {
      linkedInSessions.delete(activeSession.sessionId);
      feedCache.delete(`oauth:${activeSession.sessionId}`);
    }
    clearSessionCookie(res);
    res.setHeader('Cache-Control', 'no-store');
    res.json({ disconnected: true });
  });

  // Mount Vite dev middleware in development, or serve built dist/ in production
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      const indexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
