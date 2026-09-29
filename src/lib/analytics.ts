/**
 * The MVP keeps a small, browser-local event history. Only anonymous interaction
 * metadata belongs here; never pass names, email, phone, messages or image data.
 * Register an adapter when connecting GA4 / Meta / a first-party endpoint.
 */
export const ANALYTICS_STORAGE_KEY = "dart:analytics:v1";
export const ANALYTICS_SESSION_KEY = "dart:session:v1";
export const MAX_ANALYTICS_EVENTS = 500;

export const ANALYTICS_EVENT_NAMES = [
  "page_view",
  "click_view_artworks",
  "click_artwork",
  "click_buy_artwork",
  "click_commission",
  "commission_form_start",
  "commission_form_submit",
  "click_contact",
  "click_instagram",
  "purchase_form_start",
  "purchase_form_submit",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

export interface AnalyticsMetadata {
  /** A fixed UI location, such as hero, navigation or artwork_detail. */
  source?: string;
  artworkId?: string;
  medium?: string;
  price?: number;
}

export interface AnalyticsEvent {
  id: string;
  name: AnalyticsEventName;
  timestamp: string;
  sessionId: string;
  metadata: AnalyticsMetadata;
}

export type AnalyticsAdapter = (event: AnalyticsEvent) => void | Promise<void>;

let memoryEvents: AnalyticsEvent[] = [];
let memorySessionId: string | undefined;
let memoryOnly = false;
let listeningForStorage = false;
const subscribers = new Set<() => void>();
const adapters = new Set<AnalyticsAdapter>();

function createId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

function cleanMetadata(metadata: AnalyticsMetadata): AnalyticsMetadata {
  const result: AnalyticsMetadata = {};
  // An explicit allowlist prevents arbitrary form payloads from being retained.
  for (const key of ["source", "artworkId", "medium"] as const) {
    const value = metadata[key];
    if (typeof value === "string") result[key] = value.slice(0, 100);
  }
  if (typeof metadata.price === "number" && Number.isFinite(metadata.price)) {
    result.price = metadata.price;
  }
  return result;
}

function isStoredEvent(value: unknown): value is AnalyticsEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as Partial<AnalyticsEvent>;
  return (
    typeof event.id === "string" &&
    typeof event.name === "string" &&
    (ANALYTICS_EVENT_NAMES as readonly string[]).includes(event.name) &&
    typeof event.timestamp === "string" &&
    Number.isFinite(Date.parse(event.timestamp)) &&
    typeof event.sessionId === "string" &&
    event.metadata !== null &&
    typeof event.metadata === "object"
  );
}

export function getAnalyticsEvents(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  // After a failed write, storage can still be readable but contain older data.
  // Keep the complete memory buffer until a later write succeeds or it is cleared.
  if (memoryOnly) return [...memoryEvents];
  try {
    const raw = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!raw) return [...memoryEvents];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...memoryEvents];
    memoryEvents = parsed
      .filter(isStoredEvent)
      .slice(-MAX_ANALYTICS_EVENTS)
      .map((event) => ({
        id: event.id,
        name: event.name,
        timestamp: event.timestamp,
        sessionId: event.sessionId,
        metadata: cleanMetadata(event.metadata),
      }));
  } catch {
    // Private browsing, disabled storage and malformed test data remain usable.
  }
  return [...memoryEvents];
}

function getSessionId(): string {
  if (memorySessionId) return memorySessionId;
  try {
    const stored = window.sessionStorage.getItem(ANALYTICS_SESSION_KEY);
    if (stored) return (memorySessionId = stored);
    memorySessionId = createId();
    window.sessionStorage.setItem(ANALYTICS_SESSION_KEY, memorySessionId);
  } catch {
    memorySessionId ??= createId();
  }
  return memorySessionId;
}

function notifySubscribers(): void {
  subscribers.forEach((subscriber) => subscriber());
}

function listenForStorageChanges(): void {
  if (typeof window === "undefined" || listeningForStorage) return;
  window.addEventListener("storage", (event) => {
    if (event.key !== ANALYTICS_STORAGE_KEY && event.key !== null) return;
    if (event.newValue === null) {
      // An explicit clear in another tab also clears unsaved events in this tab.
      memoryEvents = [];
      memoryOnly = false;
    } else if (!memoryOnly) {
      memoryEvents = [];
    }
    notifySubscribers();
  });
  listeningForStorage = true;
}

/** Re-read storage on demand, useful when inspecting events during development. */
export function refreshAnalyticsEvents(): void {
  notifySubscribers();
}

export function trackEvent(
  name: AnalyticsEventName,
  metadata: AnalyticsMetadata = {},
): void {
  if (typeof window === "undefined") return;
  listenForStorageChanges();
  const event: AnalyticsEvent = {
    id: createId(),
    name,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    metadata: cleanMetadata(metadata),
  };
  memoryEvents = [...getAnalyticsEvents(), event].slice(-MAX_ANALYTICS_EVENTS);
  try {
    window.localStorage.setItem(
      ANALYTICS_STORAGE_KEY,
      JSON.stringify(memoryEvents),
    );
    memoryOnly = false;
  } catch {
    // Analytics must never prevent a form or CTA from working.
    memoryOnly = true;
  }
  if (process.env.NODE_ENV !== "production")
    console.info("[DART analytics]", event);
  notifySubscribers();
  adapters.forEach((adapter) => {
    try {
      void Promise.resolve(adapter(event)).catch(() => undefined);
    } catch {
      // A third-party adapter must not interrupt the visitor experience.
    }
  });
}

/** Add a provider once at the app boundary; CTA components stay unchanged. */
export function addAnalyticsAdapter(adapter: AnalyticsAdapter): () => void {
  adapters.add(adapter);
  return () => {
    adapters.delete(adapter);
  };
}

/** Includes changes made in other tabs, as well as the current page. */
export function subscribeToAnalytics(subscriber: () => void): () => void {
  subscribers.add(subscriber);
  listenForStorageChanges();
  return () => {
    subscribers.delete(subscriber);
  };
}

export function clearAnalyticsEvents(): void {
  memoryEvents = [];
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(ANALYTICS_STORAGE_KEY);
      memoryOnly = false;
    } catch {
      // Do not restore old persisted events if removal is blocked.
      memoryOnly = true;
    }
  }
  notifySubscribers();
}
