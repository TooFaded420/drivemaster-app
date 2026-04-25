import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiting with graceful degradation.
 *
 * If UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are present, we enforce
 * sliding-window limits backed by Upstash Redis. If either is missing (local
 * dev, CI without secrets, etc.) every call becomes a no-op so builds and
 * local runs are never blocked.
 *
 * Usage:
 *   const rl = getRateLimiter("parent:generate", 5, 60 * 60);
 *   const { success, remaining, retryAfter } = await rl.limit(
 *     getIdentifier(req, user.id)
 *   );
 *   if (!success) return new NextResponse(..., { status: 429 });
 */

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  /** Seconds the caller should wait before retrying. 0 when success. */
  retryAfter: number;
}

export interface RateLimiter {
  limit: (identifier: string) => Promise<RateLimitResult>;
}

const limiters = new Map<string, RateLimiter>();
let warnedAboutMissingEnv = false;

function hasUpstashEnv(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

function createStubLimiter(limit: number): RateLimiter {
  return {
    limit: async () => ({ success: true, remaining: limit, retryAfter: 0 }),
  };
}

function createUpstashLimiter(
  name: string,
  limit: number,
  windowSeconds: number
): RateLimiter {
  const redis = Redis.fromEnv();
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
    analytics: true,
    prefix: `aceyourpermit:rl:${name}`,
  });

  return {
    limit: async (identifier: string) => {
      const res = await ratelimit.limit(identifier);
      const retryAfter = res.success
        ? 0
        : Math.max(0, Math.ceil((res.reset - Date.now()) / 1000));
      return {
        success: res.success,
        remaining: res.remaining,
        retryAfter,
      };
    },
  };
}

/**
 * Get (or lazily build) a named rate limiter.
 * Safe to call per-request — limiters are cached module-scoped so we don't
 * re-create a Redis client on every call.
 */
export function getRateLimiter(
  name: string,
  limit: number,
  windowSeconds: number
): RateLimiter {
  const cacheKey = `${name}:${limit}:${windowSeconds}`;
  const cached = limiters.get(cacheKey);
  if (cached) return cached;

  let limiter: RateLimiter;
  if (hasUpstashEnv()) {
    limiter = createUpstashLimiter(name, limit, windowSeconds);
  } else {
    if (!warnedAboutMissingEnv) {
      warnedAboutMissingEnv = true;
      console.warn(
        "[ratelimit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set — rate limiting is a no-op."
      );
    }
    limiter = createStubLimiter(limit);
  }

  limiters.set(cacheKey, limiter);
  return limiter;
}

/**
 * Stable identifier for a rate-limit bucket.
 * Prefer the authenticated user id when we have it. Otherwise fall back to
 * the first x-forwarded-for hop, then any x-real-ip header, then "anon".
 */
export function getIdentifier(req: NextRequest, userId?: string): string {
  if (userId) return `user:${userId}`;

  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return `ip:${first}`;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return `ip:${realIp}`;

  return "ip:anon";
}

/**
 * Build the standard 429 JSON payload + headers. Routes call this when a
 * limiter returns `success: false`.
 */
export function rateLimitHeaders(retryAfter: number): HeadersInit {
  return {
    "Retry-After": String(Math.max(1, retryAfter)),
  };
}
