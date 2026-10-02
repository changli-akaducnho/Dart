export const PRODUCTION_SITE_URL = "https://dart.dartstudio.workers.dev";

// Local development settings must never become production canonical URLs.
export function getSiteUrl(
  configured = process.env.NEXT_PUBLIC_SITE_URL,
  environment = process.env.NODE_ENV,
): string {
  if (!configured?.trim()) return PRODUCTION_SITE_URL;
  try {
    const url = new URL(configured.trim());
    const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
    const local = host === "localhost" || host.endsWith(".localhost") ||
      host.endsWith(".local") || host === "::1" || host === "0.0.0.0" ||
      /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
      return PRODUCTION_SITE_URL;
    }
    if (environment === "production" && (local || url.protocol !== "https:")) {
      return PRODUCTION_SITE_URL;
    }
    return url.origin;
  } catch {
    return PRODUCTION_SITE_URL;
  }
}

export function absoluteSiteUrl(path = "/") {
  return new URL(path, `${getSiteUrl()}/`).toString();
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
