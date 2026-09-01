"use client";

import { useEffect, useState } from "react";
import { PlayMark } from "@/components/ui/PlayMark";
import { cx } from "@/lib/utils";

/**
 * ROOM ALLOCATION
 *
 * Only asked of families and friend groups — a solo traveller needs one room
 * and a couple almost always shares one, so asking them would be a step that
 * exists purely to be clicked through.
 *
 * Rooms are serialised into the step's selection as `"2a1c"` per room, so the
 * whole flow keeps its single `Record<string, string[]>` shape and the enquiry
 * form can read it without a special case.
 */

export interface Room {
  adults: number;
  children: number;
}

const MAX_ROOMS = 6;
const MAX_PER_ROOM = 6;

export function encodeRooms(rooms: Room[]): string[] {
  return rooms.map((r) => `${r.adults}a${r.children}c`);
}

export function decodeRooms(values: string[] | undefined): Room[] {
  if (!values?.length) return [{ adults: 2, children: 0 }];
  return values.map((v) => {
    const m = v.match(/^(\d+)a(\d+)c$/);
    return m ? { adults: Number(m[1]), children: Number(m[2]) } : { adults: 2, children: 0 };
  });
}

/**
 * Two looks, because this control lives in two very different places. On
 * `/customize` it sits on the page's own cream surface. In the hero it sits
 * over photography, where a solid cream card reads as a form that was pasted
 * onto the picture — so there it becomes frosted glass and the type goes
 * light, matching the rest of the starter instead of interrupting it.
 */
export type RoomPickerTone = "surface" | "glass";

const TONE = {
  surface: {
    wrap: "mx-auto mt-12 w-full max-w-xl",
    card: "overflow-hidden rounded-lg border border-border bg-surface",
    head: "border-b border-border bg-surface-raised",
    headText: "text-primary",
    divide: "divide-y divide-[--color-border]",
    label: "text-text-strong",
    hint: "text-muted",
    value: "text-text-strong",
    remove: "text-muted hover:text-accent",
    add: "border-dashed border-border-strong text-primary hover:border-primary hover:bg-primary/5",
    total: "text-muted",
    stepIdle: "border-border-strong text-text hover:border-primary hover:bg-primary/10 hover:text-primary",
    stepOff: "border-border text-muted/40",
  },
  /**
   * Note the fill does the work here, not `backdrop-filter`. Blur would be
   * the nicer effect, but the starter's step-slide animates opacity, which
   * makes its panel a backdrop root — and a backdrop root has nothing painted
   * behind it to sample, so the blur silently does nothing. Relying on it
   * would also mean any future opacity animation could break legibility
   * without anyone noticing, so the panel is simply opaque enough to read.
   */
  glass: {
    // One panel holds the rooms, the add button and the total. Splitting them
    // left the button and the summary sitting on bare footage while only the
    // rooms had a surface, which read as three unrelated pieces.
    wrap: "mx-auto w-full max-w-lg rounded-2xl border border-sand-50/18 bg-ink-900/62 p-3.5 shadow-[0_18px_50px_-12px_rgb(16_15_14/0.6)]",
    card: "overflow-hidden rounded-xl border border-sand-50/12 bg-sand-50/[0.05]",
    head: "border-b border-sand-50/12 bg-sand-50/[0.05]",
    headText: "text-amber-300",
    divide: "divide-y divide-[rgb(255_255_255/0.12)]",
    label: "text-sand-50",
    hint: "text-sand-100/70",
    value: "text-sand-50",
    remove: "text-sand-100/70 hover:text-amber-300",
    add: "border-dashed border-sand-50/30 text-sand-50 hover:border-amber-400 hover:bg-sand-50/10",
    total: "text-sand-100/80",
    stepIdle: "border-sand-50/35 text-sand-50 hover:border-amber-400 hover:bg-amber-400/15 hover:text-amber-300",
    stepOff: "border-sand-50/15 text-sand-50/30",
  },
} as const;

export function RoomPicker({
  value,
  onChange,
  tone = "surface",
}: {
  value?: string[];
  onChange: (encoded: string[]) => void;
  tone?: RoomPickerTone;
}) {
  const t = TONE[tone];
  const [rooms, setRooms] = useState<Room[]>(() => decodeRooms(value));

  // Publish upward whenever the allocation changes, so the sticky bar summary
  // and the CTA enablement stay in step with what is on screen.
  useEffect(() => {
    onChange(encodeRooms(rooms));
    // `onChange` is recreated each render by the parent; depending on it would
    // loop. The rooms array is the only real input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms]);

  const totalAdults = rooms.reduce((n, r) => n + r.adults, 0);
  const totalChildren = rooms.reduce((n, r) => n + r.children, 0);

  const update = (index: number, key: keyof Room, delta: number) =>
    setRooms((prev) =>
      prev.map((room, i) => {
        if (i !== index) return room;
        const next = { ...room, [key]: room[key] + delta };
        // At least one adult per room — a room of children alone cannot be booked.
        if (next.adults < 1) next.adults = 1;
        if (next.children < 0) next.children = 0;
        if (next.adults + next.children > MAX_PER_ROOM) return room;
        return next;
      }),
    );

  return (
    <div className={t.wrap}>
      <ul className="space-y-3.5">
        {rooms.map((room, index) => (
          <li
            key={index}
            className={t.card}
          >
            <div className={cx("flex items-center justify-between gap-4 px-5 py-3.5", t.head)}>
              <p className={cx("flex items-center gap-2.5 text-caption font-semibold uppercase tracking-[0.14em]", t.headText)}>
                <PlayMark className="size-3.5" />
                Room {index + 1}
              </p>
              {rooms.length > 1 && (
                <button
                  type="button"
                  onClick={() => setRooms((prev) => prev.filter((_, i) => i !== index))}
                  className={cx("text-label font-semibold underline underline-offset-4 transition-colors", t.remove)}
                >
                  Remove
                </button>
              )}
            </div>

            <div className={t.divide}>
              <Row
                t={t}
                label="Adults"
                hint="12 yrs and over"
                value={room.adults}
                onDec={() => update(index, "adults", -1)}
                onInc={() => update(index, "adults", 1)}
                canDec={room.adults > 1}
                canInc={room.adults + room.children < MAX_PER_ROOM}
              />
              <Row
                t={t}
                label="Children"
                hint="0 to 11 yrs"
                value={room.children}
                onDec={() => update(index, "children", -1)}
                onInc={() => update(index, "children", 1)}
                canDec={room.children > 0}
                canInc={room.adults + room.children < MAX_PER_ROOM}
              />
            </div>
          </li>
        ))}
      </ul>

      {rooms.length < MAX_ROOMS && (
        <button
          type="button"
          onClick={() => setRooms((prev) => [...prev, { adults: 2, children: 0 }])}
          className={cx("mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3.5 text-label font-semibold transition-colors duration-[--duration-fast]", t.add)}
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add another room
        </button>
      )}

      <p aria-live="polite" className={cx("mt-5 text-center text-label", t.total)}>
        {rooms.length} {rooms.length === 1 ? "room" : "rooms"} · {totalAdults}{" "}
        {totalAdults === 1 ? "adult" : "adults"}
        {totalChildren > 0 && `, ${totalChildren} ${totalChildren === 1 ? "child" : "children"}`}
      </p>
    </div>
  );
}

type Tone = (typeof TONE)[RoomPickerTone];

function Row({
  t,
  label,
  hint,
  value,
  onDec,
  onInc,
  canDec,
  canInc,
}: {
  t: Tone;
  label: string;
  hint: string;
  value: number;
  onDec: () => void;
  onInc: () => void;
  canDec: boolean;
  canInc: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-5 py-4">
      <p className="min-w-0 text-left">
        <span className={cx("block font-semibold", t.label)}>{label}</span>
        <span className={cx("mt-0.5 block text-caption", t.hint)}>{hint}</span>
      </p>

      <div className="flex shrink-0 items-center gap-4">
        <Step t={t} onClick={onDec} disabled={!canDec} label={`One fewer ${label.toLowerCase()}`}>
          <path d="M5 12h14" />
        </Step>
        <output className={cx("w-6 text-center text-lede font-semibold tabular-nums", t.value)}>
          {value}
        </output>
        <Step t={t} onClick={onInc} disabled={!canInc} label={`One more ${label.toLowerCase()}`}>
          <path d="M12 5v14M5 12h14" />
        </Step>
      </div>
    </div>
  );
}

function Step({
  t,
  children,
  onClick,
  disabled,
  label,
}: {
  t: Tone;
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cx(
        "grid size-10 place-items-center rounded-full border transition-colors duration-[--duration-fast]",
        disabled ? cx("cursor-not-allowed", t.stepOff) : t.stepIdle,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {children}
        </g>
      </svg>
    </button>
  );
}
