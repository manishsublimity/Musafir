"use client";

import { useEffect, useRef } from "react";

/**
 * PLANE CURSOR
 *
 * Replaces the system pointer with the brand Plane, trailing a soft contrail,
 * and transforms into the Fav Logo over anything interactive.
 *
 * Design notes that matter:
 *
 * - Both assets are the exact exported Figma layers (`/cursor/plane.svg`,
 *   `/cursor/fav-logo.svg`). Neither is redrawn, and neither is ever scaled
 *   non-uniformly, so proportions are preserved.
 *
 * - The plane points along its actual direction of travel. The asset's nose
 *   already sits at roughly -26deg (upper right), so that offset is subtracted
 *   from the travel heading — otherwise the plane flies permanently crabbed.
 *   Interpolation takes the shortest angular path, so crossing the -180/180
 *   boundary does not send it spinning the long way round.
 *
 * - The contrail is drawn on a canvas rather than as DOM nodes. Hundreds of
 *   blurred spans is a compositing problem; one canvas with radial gradients
 *   is a single draw call per frame and looks considerably softer.
 *
 * - Everything is frame-rate independent: damping uses `1 - k^dt` rather than a
 *   fixed per-frame lerp, so the feel is identical at 60Hz and 144Hz.
 *
 * - The whole thing self-disables on coarse pointers and under reduced motion,
 *   where a custom cursor is either meaningless or actively unwelcome.
 */

/** The asset's own heading in degrees, measured nose-from-tail. */
const ASSET_HEADING = -26;

/** Pixels of travel between contrail puffs. */
const PUFF_SPACING = 5.5;
const MAX_PARTICLES = 220;

const INTERACTIVE = [
  "a[href]",
  "button",
  '[role="button"]',
  "input",
  "select",
  "textarea",
  "label",
  "summary",
  "[data-cursor-hover]",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  life: number;
  max: number;
  wob: number;
  drift: number;
}

export function PlaneCursor() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // A custom cursor is meaningless without a real pointer, and is exactly the
    // kind of decorative motion the reduced-motion preference asks us to drop.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const canvas = root.querySelector<HTMLCanvasElement>("canvas");
    const cursor = root.querySelector<HTMLElement>("[data-cursor]");
    const plane = root.querySelector<HTMLElement>("[data-plane]");
    const fav = root.querySelector<HTMLElement>("[data-fav]");
    if (!canvas || !cursor || !plane || !fav) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    document.documentElement.classList.add("has-plane-cursor");
    cursor.style.opacity = "0";
    canvas.style.opacity = "0";

    /* ------------------------------------------------------------- state -- */

    let width = window.innerWidth;
    let height = window.innerHeight;
    // Cap DPR: a full-viewport canvas at 3x on a retina display is a lot of
    // fill rate for something purely decorative.
    let dpr = Math.min(window.devicePixelRatio || 1, 1.6);

    const pointer = {
      x: width / 2,
      y: height / 2,
      tx: width / 2,
      ty: height / 2,
      vx: 0,
      vy: 0,
    };

    let angle = 0;
    let trailCarry = 0;
    let hovering = false;
    let seen = false;
    let raf = 0;
    let last = performance.now();

    const particles: Particle[] = [];

    /* ------------------------------------------------------------ canvas -- */

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    /* ----------------------------------------------------------- pointer -- */

    const onMove = (event: PointerEvent) => {
      pointer.tx = event.clientX;
      pointer.ty = event.clientY;
      if (!seen) {
        // Jump to the first real position rather than flying in from centre.
        seen = true;
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
        cursor.style.opacity = "1";
        canvas.style.opacity = "1";
      }
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const next = Boolean(target.closest(INTERACTIVE));
      if (next === hovering) return;
      hovering = next;
      cursor.dataset.state = hovering ? "hover" : "default";
    };

    const onLeaveWindow = () => {
      cursor.style.opacity = "0";
      canvas.style.opacity = "0";
    };
    const onEnterWindow = () => {
      if (!seen) return;
      cursor.style.opacity = "1";
      canvas.style.opacity = "1";
    };

    /* -------------------------------------------------------------- trail -- */

    const emit = (x: number, y: number, ox: number, oy: number, scale: number) => {
      const speed = Math.hypot(pointer.vx, pointer.vy);
      const heading = Math.atan2(oy, ox);
      particles.push({
        x: x + (Math.random() - 0.5) * 9,
        y: y + (Math.random() - 0.5) * 9,
        // Push backwards along the flight path, faster when moving faster.
        vx: Math.cos(heading) * (-0.25 - speed * 0.1) + (Math.random() - 0.5) * 0.34,
        vy: Math.sin(heading) * (-0.25 - speed * 0.1) + (Math.random() - 0.5) * 0.34 - 0.08,
        r: (7 + Math.random() * 13) * scale,
        a: 0.1 + Math.random() * 0.1,
        life: 0,
        max: 55 + Math.random() * 75,
        wob: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.018,
      });
    };

    const spawnTrail = (dt: number) => {
      const speed = Math.hypot(pointer.vx, pointer.vy);
      if (speed < 0.08) return;

      // Spawn by distance travelled rather than per frame, so trail density is
      // identical whether the display runs at 60Hz or 144Hz.
      trailCarry += speed * dt;
      const count = Math.min(6, Math.floor(trailCarry / PUFF_SPACING));
      if (count < 1) return;
      trailCarry -= count * PUFF_SPACING;

      const magnitude = Math.max(speed, 0.001);
      const ox = pointer.vx / magnitude;
      const oy = pointer.vy / magnitude;

      for (let i = 0; i < count; i++) {
        const back = 12 + i * 5.5;
        emit(
          pointer.x - ox * (back + Math.random() * 8),
          pointer.y - oy * (back + Math.random() * 8),
          ox,
          oy,
          0.8 + Math.random() * 0.5,
        );
      }

      if (particles.length > MAX_PARTICLES) {
        particles.splice(0, particles.length - MAX_PARTICLES);
      }
    };

    const drawParticle = (p: Particle) => {
      const t = p.life / p.max;
      const alpha = p.a * (1 - Math.pow(t, 0.82));
      const radius = p.r * (0.8 + t * 1.6);

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
      // Warm white rather than pure white — it sits inside the amber/charcoal
      // palette instead of reading as a cold grey smudge on the dark field.
      gradient.addColorStop(0, `rgba(255, 248, 236, ${alpha})`);
      gradient.addColorStop(0.34, `rgba(255, 236, 205, ${alpha * 0.7})`);
      gradient.addColorStop(0.78, "rgba(255, 220, 160, 0.04)");
      gradient.addColorStop(1, "rgba(255, 220, 160, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    /* --------------------------------------------------------------- loop -- */

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 2);
      last = now;

      // Frame-rate independent follow. The plane trails the true pointer by a
      // few frames, which is what makes it feel light rather than glued on.
      const follow = 1 - Math.pow(0.0009, dt);
      const prevX = pointer.x;
      const prevY = pointer.y;
      pointer.x += (pointer.tx - pointer.x) * follow;
      pointer.y += (pointer.ty - pointer.y) * follow;

      // Velocity from actual movement, then filtered so rotation is stable.
      const rawVx = (pointer.x - prevX) / Math.max(dt, 0.001);
      const rawVy = (pointer.y - prevY) / Math.max(dt, 0.001);
      const mix = 1 - Math.pow(0.82, dt);
      pointer.vx += (rawVx - pointer.vx) * mix;
      pointer.vy += (rawVy - pointer.vy) * mix;

      if (!hovering) spawnTrail(dt);

      ctx.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        p.wob += p.drift * dt * 20;

        const t = p.life / p.max;
        const lift = (0.18 + t * 0.42) * dt;
        p.x += p.vx * dt + Math.sin(p.wob) * lift;
        p.y += p.vy * dt - (0.045 + t * 0.05) * dt;
        p.vx *= Math.pow(0.991, dt);
        p.vy *= Math.pow(0.991, dt);

        if (p.life >= p.max) {
          particles.splice(i, 1);
          continue;
        }
        drawParticle(p);
      }

      // Point the nose along the direction of travel. Below the threshold the
      // heading is held, so a stationary cursor does not jitter.
      const travel = Math.hypot(pointer.vx, pointer.vy);
      const heading =
        travel > 0.12
          ? (Math.atan2(pointer.vy, pointer.vx) * 180) / Math.PI - ASSET_HEADING
          : angle;

      // A small extra tilt out of the turn, capped so it reads as banking.
      const bank = Math.max(-14, Math.min(14, -pointer.vx * 0.8));
      const target = heading + bank;

      // Shortest angular path, so -179 -> 179 turns 2deg rather than 358.
      let delta = ((target - angle + 180) % 360) - 180;
      if (delta < -180) delta += 360;
      angle += delta * (1 - Math.pow(0.0015, dt));

      cursor.style.transform = `translate3d(${pointer.x.toFixed(2)}px, ${pointer.y.toFixed(2)}px, 0)`;
      plane.style.rotate = `${angle.toFixed(2)}deg`;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeaveWindow);
    document.addEventListener("pointerenter", onEnterWindow);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeaveWindow);
      document.removeEventListener("pointerenter", onEnterWindow);
      document.documentElement.classList.remove("has-plane-cursor");
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true">
      {/* The contrail lives on its own untransformed canvas — a transform on an
          ancestor would make fixed-position descendants resolve against it. */}
      <canvas className="plane-cursor__trail" />

      <span data-cursor data-state="default" className="plane-cursor">
        <span className="plane-cursor__glow" />
        {/* Both states are always mounted and cross-fade, so the change reads
            as one object transforming rather than two images swapping. */}
        <span data-plane className="plane-cursor__plane" />
        <span data-fav className="plane-cursor__fav" />
      </span>
    </div>
  );
}
