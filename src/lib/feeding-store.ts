// Browser-safe store for user-edited feeding schedules (persisted in localStorage).
import { useCallback, useSyncExternalStore } from "react";

import { getFeeding, type FeedStep } from "./crops";

export type FeedOverride = Partial<Pick<FeedStep, "water" | "nutrients" | "dose" | "tip">>;
type Overrides = Record<string, Record<string, FeedOverride>>;

const KEY = "lab.feeding.overrides.v1";

let cache: Overrides | null = null;
const listeners = new Set<() => void>();

function read(): Overrides {
  if (cache) return cache;
  if (typeof window === "undefined") return (cache = {});
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as Overrides) : {};
  } catch {
    cache = {};
  }
  return cache;
}

function write(next: Overrides) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — keep in-memory only */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function setFeedOverride(slug: string, stageId: string, patch: FeedOverride) {
  const current = read();
  const forCrop = { ...(current[slug] ?? {}) };
  forCrop[stageId] = { ...(forCrop[stageId] ?? {}), ...patch };
  write({ ...current, [slug]: forCrop });
}

export function resetFeedOverrides(slug: string) {
  const current = read();
  const next = { ...current };
  delete next[slug];
  write(next);
}

/** Base schedule merged with any user edits for this crop. */
export function useFeedingSchedule(slug: string): { steps: FeedStep[]; edited: boolean } {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => read()[slug],
    () => undefined,
  );
  const base = getFeeding(slug);
  const merged = base.map((s) => ({ ...s, ...(snapshot?.[s.stageId] ?? {}) }));
  return { steps: merged, edited: Boolean(snapshot && Object.keys(snapshot).length > 0) };
}

export function useFeedActions(slug: string) {
  const update = useCallback(
    (stageId: string, patch: FeedOverride) => setFeedOverride(slug, stageId, patch),
    [slug],
  );
  const reset = useCallback(() => resetFeedOverrides(slug), [slug]);
  return { update, reset };
}
