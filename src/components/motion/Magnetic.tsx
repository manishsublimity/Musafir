"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { cx } from "@/lib/utils";

interface MagneticProps {
  children: ReactNode;
  /** Pixels the element travels at the far edge of its hover field. */
  strength?: number;
  /** How far outside the element the field extends, as a fraction of its size. */
  radius?: number;
  className?: string;
}

/**
 * Pulls its child gently toward the cursor.
 *
 * Only ever engages on fine pointers: on touch there is no hover state to
 * respond to, and on a coarse pointer the transform would fight the tap target.
 */
export function Magnetic({ children, strength = 14, radius = 0.6, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const quickX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const quickY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx0 = rect.left + rect.width / 2;
      const cy0 = rect.top + rect.height / 2;
      const dx = event.clientX - cx0;
      const dy = event.clientY - cy0;
      const field = Math.max(rect.width, rect.height) * (1 + radius);
      const distance = Math.hypot(dx, dy);

      if (distance > field) {
        quickX(0);
        quickY(0);
        return;
      }
      const pull = 1 - distance / field;
      quickX((dx / field) * strength * pull * 4);
      quickY((dy / field) * strength * pull * 4);
    };

    const onLeave = () => {
      quickX(0);
      quickY(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength, radius]);

  return (
    <span ref={ref} className={cx("inline-block will-change-transform", className)}>
      {children}
    </span>
  );
}
