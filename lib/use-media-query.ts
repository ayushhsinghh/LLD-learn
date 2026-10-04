"use client";

import { useCallback, useSyncExternalStore } from "react";

/** A reactive browser preference, with a stable server snapshot for hydration. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    if (typeof window === "undefined" || !window.matchMedia) return () => {};
    const media = window.matchMedia(query);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);
  const getSnapshot = useCallback(() =>
    typeof window !== "undefined" && Boolean(window.matchMedia?.(query).matches), [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function useReducedMotionPreference(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
