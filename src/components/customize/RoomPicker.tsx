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

export function RoomPicker({
  value,
  onChange,
}: {
  value?: string[];
  onChange: (encoded: string[]) => void;
}) {
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
    <div className="mx-auto mt-12 w-full max-w-xl">
      <ul className="space-y-4">
        {rooms.map((room, index) => (
          <li
            key={index}
            className="overflow-hidden rounded-lg border border-border bg-surface"
          >
            <div className="flex items-center justify-between gap-4 border-b border-border bg-surface-raised px-6 py-4">
              <p className="flex items-center gap-2.5 text-caption font-semibold uppercase tracking-[0.14em] text-primary">
                <PlayMark className="size-3.5" />
                Room {index + 1}
              </p>
              {rooms.length > 1 && (
                <button
                  type="button"
                  onClick={() => setRooms((prev) => prev.filter((_, i) => i !== index))}
                  className="text-label font-semibold text-muted underline underline-offset-4 transition-colors hover:text-accent"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="divide-y divide-[--color-border]">
              <Row
                label="Adults"
                hint="12 yrs and over"
                value={room.adults}
                onDec={() => update(index, "adults", -1)}
                onInc={() => update(index, "adults", 1)}
                canDec={room.adults > 1}
                canInc={room.adults + room.children < MAX_PER_ROOM}
              />
              <Row
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
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border-strong px-5 py-4 text-label font-semibold text-primary transition-colors duration-[--duration-fast] hover:border-primary hover:bg-primary/5"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add another room
        </button>
      )}

      <p aria-live="polite" className="mt-6 text-center text-label text-muted">
        {rooms.length} {rooms.length === 1 ? "room" : "rooms"} · {totalAdults}{" "}
        {totalAdults === 1 ? "adult" : "adults"}
        {totalChildren > 0 && `, ${totalChildren} ${totalChildren === 1 ? "child" : "children"}`}
      </p>
    </div>
  );
}

function Row({
  label,
  hint,
  value,
  onDec,
  onInc,
  canDec,
  canInc,
}: {
  label: string;
  hint: string;
  value: number;
  onDec: () => void;
  onInc: () => void;
  canDec: boolean;
  canInc: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-5">
      <p className="min-w-0">
        <span className="block font-semibold text-text-strong">{label}</span>
        <span className="mt-0.5 block text-caption text-muted">{hint}</span>
      </p>

      <div className="flex shrink-0 items-center gap-4">
        <Step onClick={onDec} disabled={!canDec} label={`One fewer ${label.toLowerCase()}`}>
          <path d="M5 12h14" />
        </Step>
        <output className="w-6 text-center text-lede font-semibold tabular-nums text-text-strong">
          {value}
        </output>
        <Step onClick={onInc} disabled={!canInc} label={`One more ${label.toLowerCase()}`}>
          <path d="M12 5v14M5 12h14" />
        </Step>
      </div>
    </div>
  );
}

function Step({
  children,
  onClick,
  disabled,
  label,
}: {
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
        disabled
          ? "cursor-not-allowed border-border text-muted/40"
          : "border-border-strong text-text hover:border-primary hover:bg-primary/10 hover:text-primary",
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
