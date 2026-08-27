"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/utils";

interface DragRailProps {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  /** Accessible name for the scrollable region. */
  label: string;
  snap?: boolean;
  /** Renders prev/next controls above the rail. */
  controls?: boolean;
}

/**
 * A horizontal rail built on native overflow scrolling.
 *
 * Native scroll gives us touch momentum, trackpad inertia, keyboard access and
 * scroll-snap for free — all of which a hand-rolled transform carousel loses.
 * The only thing added on top is click-and-drag for mouse users, who otherwise
 * have no way to pan.
 */
export function DragRail({
  children,
  className,
  trackClassName,
  label,
  snap = true,
  controls = true,
}: DragRailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });

  const syncEdges = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    syncEdges();
    el.addEventListener("scroll", syncEdges, { passive: true });
    const observer = new ResizeObserver(syncEdges);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", syncEdges);
      observer.disconnect();
    };
  }, [syncEdges]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onDown = (event: PointerEvent) => {
      // Let text selection and control clicks behave normally.
      if (event.button !== 0) return;
      drag.current = {
        active: true,
        startX: event.clientX,
        startScroll: el.scrollLeft,
        moved: 0,
      };
      el.style.scrollSnapType = "none";
      el.setPointerCapture(event.pointerId);
    };

    const onMove = (event: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = event.clientX - drag.current.startX;
      drag.current.moved = Math.abs(dx);
      if (drag.current.moved > 4) el.style.cursor = "grabbing";
      el.scrollLeft = drag.current.startScroll - dx;
    };

    const onUp = (event: PointerEvent) => {
      if (!drag.current.active) return;
      drag.current.active = false;
      el.style.cursor = "";
      if (snap) el.style.scrollSnapType = "";
      if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
    };

    // A drag that moved should not also fire the card's click.
    const onClickCapture = (event: MouseEvent) => {
      if (drag.current.moved > 6) {
        event.preventDefault();
        event.stopPropagation();
        drag.current.moved = 0;
      }
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("click", onClickCapture, true);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, [snap]);

  const page = (direction: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className={cx("relative", className)}>
      {controls && (
        <div className="container-editorial mb-6 flex justify-end gap-2">
          <RailButton
            direction="prev"
            disabled={atStart}
            onClick={() => page(-1)}
            label={`Scroll ${label} left`}
          />
          <RailButton
            direction="next"
            disabled={atEnd}
            onClick={() => page(1)}
            label={`Scroll ${label} right`}
          />
        </div>
      )}
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={cx(
          "no-scrollbar flex overflow-x-auto overscroll-x-contain",
          snap && "snap-x snap-mandatory",
          trackClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

function RailButton({
  direction,
  disabled,
  onClick,
  label,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-11 place-items-center rounded-full border border-border text-text transition-[background-color,border-color,opacity] duration-[--duration-fast] ease-[--ease-expo] hover:border-border-strong hover:bg-surface-raised disabled:pointer-events-none disabled:opacity-30"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
        <path
          d={direction === "next" ? "M5 12h14m-6-6 6 6-6 6" : "M19 12H5m6 6-6-6 6-6"}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
