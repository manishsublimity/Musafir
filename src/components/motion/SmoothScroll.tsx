"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { ScrollTrigger, ensureGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Inertial smooth scrolling, wired into GSAP's ScrollTrigger so the two share a
 * single scroll position and a single RAF loop.
 *
 * Deliberately does nothing when the user prefers reduced motion: hijacking the
 * scroll is exactly the kind of movement that preference is asking us not to do,
 * and native scrolling is a complete, working fallback.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    // Coarse pointers already have momentum scrolling from the OS; adding our
    // own on top makes touch devices feel laggy rather than smooth.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const gsap = ensureGsap();
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Anchor links must still work with the scroll hijacked.
    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -96 });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // Every route change invalidates measured trigger positions.
  useEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
