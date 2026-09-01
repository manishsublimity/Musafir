"use client";

import { motion } from "motion/react";
import { cx } from "@/lib/utils";

/**
 * SOLO SELECTOR
 *
 * Choosing "Solo" is the one answer that cannot resolve to a character on its
 * own, so instead of advancing it reveals this second, smaller question. It
 * lives inside the same step rather than becoming a step of its own: it is a
 * refinement of the answer just given, and promoting it to a full step would
 * make the progress rail claim the trip got longer because someone is
 * travelling alone.
 */

const OPTIONS = [
  { id: "BOY", label: "Boy" },
  { id: "GIRL", label: "Girl" },
] as const;

export function SoloSelector({
  value,
  onSelect,
}: {
  value?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.7 }}
      className="mt-4 flex flex-col items-center gap-2.5"
    >
      <p className="text-caption font-semibold uppercase tracking-[0.14em] text-sand-100/80">
        Travelling as
      </p>

      <div role="group" aria-label="Travelling as" className="flex items-center gap-2.5">
        {OPTIONS.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(option.id)}
              className={cx(
                "h-11 min-w-[104px] rounded-pill border px-6 text-label font-semibold",
                "transition-[background-color,border-color,color] duration-[--duration-fast]",
                selected
                  ? "border-amber-400 bg-amber-400 text-ink-900"
                  : "border-sand-50/40 text-sand-50 hover:border-amber-400 hover:text-amber-300",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
