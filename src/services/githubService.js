const GITHUB_API = "https://api.github.com";
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_PREFIX = "oss-launchpad:gfi:";
const RATE_LIMIT_KEY = "oss-launchpad:github-rate-limit";

// Projects label beginner issues inconsistently, so search for the common variants together.
const BEGINNER_LABELS = ["good first issue", "good-first-issue", "beginner", "first-timers-only", "easy"];

export class GitHubError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "GitHubError";
    this.code = code;
    Object.assign(this, details);
  }
}

const memoryCache = new Map();

function readStorage(key) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode, quota); the in-memory cache still works.
  }
}

function getCached(key) {
  const entry = memoryCache.get(key) || readStorage(CACHE_PREFIX + key);
  if (!entry || Date.now() - entry.fetchedAt > CACHE_TTL_MS) return null;
  memoryCache.set(key, entry);
  return entry;
}

function setCached(key, issues) {
  const entry = { issues, fetchedAt: Date.now() };
  memoryCache.set(key, entry);
  writeStorage(CACHE_PREFIX + key, entry);
  return entry;
}

function rateLimitedError(resetAt) {
  return new GitHubError("rate_limited", "GitHub rate limit reached. Try again shortly.", { resetAt });
}

/**
 * Extracts owner/repo from a GitHub URL. Returns null for organisation or profile URLs
 * (e.g. https://github.com/EddieHubCommunity), which have no single issue tracker.
 */
export function parseGitHubRepo(url) {
  try {
    const { hostname, pathname } = new URL(url);
    if (hostname !== "github.com" && hostname !== "www.github.com") return null;
    const [owner, repo] = pathname.split("/").filter(Boolean);
    if (!owner || !repo) return null;
    return { owner, repo: repo.replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

function truncate(text, max) {
  if (!text) return "";
  const clean = text.replace(/<!--[\s\S]*?-->/g, "").replace(/\r/g, "").trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
}

function toIssue(item) {
  return {
    id: item.id,
    number: item.number,
    title: item.title,
    url: item.html_url,
    body: truncate(item.body, 600),
    labels: (item.labels || []).map((label) => (typeof label === "string" ? label : label.name)),
    comments: item.comments,
    isAssigned: Boolean(item.assignee || item.assignees?.length),
    updatedAt: item.updated_at
  };
}

/**
 * Fetches open beginner-labelled issues for a repository, cached for 10 minutes per repo.
 * Unassigned issues are listed first because they are the ones a newcomer can actually pick up.
 */
export async function getBeginnerIssues(githubUrl, { force = false } = {}) {
  const repo = parseGitHubRepo(githubUrl);
  if (!repo) {
    throw new GitHubError("invalid_repo", "This project links to a GitHub organisation, not a single repository.");
  }

  const cacheKey = `${repo.owner}/${repo.repo}`.toLowerCase();
  if (!force) {
    const cached = getCached(cacheKey);
    if (cached) return cached;
  }

  // Avoid hitting GitHub again while we already know the rate limit is exhausted.
  const knownReset = readStorage(RATE_LIMIT_KEY);
  if (knownReset && knownReset > Date.now()) throw rateLimitedError(knownReset);

  const labels = BEGINNER_LABELS.map((label) => `"${label}"`).join(",");
  const query = `repo:${repo.owner}/${repo.repo} is:issue is:open label:${labels}`;
  const params = new URLSearchParams({ q: query, sort: "updated", order: "desc", per_page: "15" });

  let response;
  try {
    response = await fetch(`${GITHUB_API}/search/issues?${params}`, {
      headers: { Accept: "application/vnd.github+json" }
    });
  } catch {
    throw new GitHubError("network", "Could not reach GitHub. Check your connection and retry.");
  }

  if (response.status === 403 || response.status === 429) {
    const remaining = response.headers.get("x-ratelimit-remaining");
    const reset = Number(response.headers.get("x-ratelimit-reset"));
    if (remaining === "0" || response.status === 429) {
      const resetAt = reset ? reset * 1000 : Date.now() + 60 * 1000;
      writeStorage(RATE_LIMIT_KEY, resetAt);
      throw rateLimitedError(resetAt);
    }
    throw new GitHubError("forbidden", "GitHub refused the request for this repository.");
  }
  if (response.status === 422 || response.status === 404) {
    throw new GitHubError("not_found", "This repository could not be found on GitHub.");
  }
  if (!response.ok) {
    throw new GitHubError("unknown", `GitHub returned an unexpected error (${response.status}).`);
  }

  const data = await response.json();
  const issues = (data.items || [])
    .filter((item) => !item.pull_request)
    .map(toIssue)
    .sort((a, b) => Number(a.isAssigned) - Number(b.isAssigned));

  return setCached(cacheKey, issues);
}
