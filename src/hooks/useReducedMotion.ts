"use client";

import { useEffect, useState } from "react";

/**
 * Reads the OS motion preference and keeps up with changes to it mid-session.
 *
 * Returns `false` on the first render so the server and client agree, then
 * corrects in an effect. Components must therefore treat this as "reduce motion
 * once known" rather than gating the *content* on it — nothing may be hidden
 * behind a value that starts wrong.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
