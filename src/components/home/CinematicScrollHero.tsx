"use client";

import { useEffect, useRef, type ReactNode } from "react";
import "@/styles/cinema.css";

/**
 * CINEMATIC SCROLL HERO
 *
 * A React port of the standalone cinematic scroll story (see
 * `standalone/mostar/`), reproducing its layer stack, easing curves and
 * scroll-mapped values exactly. Three differences from the standalone version,
 * all deliberate:
 *
 *   1. Custom properties are written to this section's own root element rather
 *      than to `documentElement`, so the hero cannot leak variables into the
 *      rest of the site.
 *   2. All copy arrives as props. The defaults are the original content
 *      verbatim, so out of the box it renders identically — but swapping in
 *      Musafir destinations is a data change, not a rewrite.
 *   3. The sights slider has been removed from the site build. The scroll rig
 *      is shortened to match, so the section ends where the last story panel
 *      exits rather than leaving ~1000px of empty scrolling behind it. The
 *      standalone page keeps the slider as the verbatim reference copy.
 *
 * The rig is 2900px on top of a sticky 100vh stage, so this occupies roughly
 * three screens of scrolling before the page continues.
 */

const ASSET = {
  sky: "https://raft-blast-61784561.figma.site/_assets/v11/16b5007d9c93971e26ffe4e0e3e37946f6bd538c.png",
  backFour: "https://raft-blast-61784561.figma.site/_assets/v11/8a7f8af50e0ce92ec2e228e7b0b4112178c51cf1.png",
  bazaar: "https://raft-blast-61784561.figma.site/_assets/v11/864afe00e41e2fa20a5aa546e15cb807e0f81384.png",
  splitLeft: "https://raft-blast-61784561.figma.site/_assets/v11/7536d7b60a1fce482cf6edf3f0bffd3bad5d0f8a.png",
  splitRight: "https://raft-blast-61784561.figma.site/_assets/v11/392db6a6a6b98e868bd7f8d3f55bb719d51e5028.png",
  bridge: "https://raft-blast-61784561.figma.site/_assets/v11/c6a6d8ef49bca43f708aa852692942c45ec950d4.png",
  frameTwo: "https://raft-blast-61784561.figma.site/_assets/v11/ba75252bab2b1c510987b74837770f7bc8a6b2d4.png",
} as const;

interface Props {
  title?: string;
  intro?: string;
  tags?: string[];
  /**
   * Rendered over the lower third of the hero. This is where the trip starter
   * lives, so the first question the site asks is answered before the
   * traveller has scrolled anywhere.
   */
  overlay?: ReactNode;
}

export function CinematicScrollHero({
  title = "MOSTAR",
  intro = "A stone arch, emerald water, and a compact old city made for slow mornings, late light, and one unforgettable crossing.",
  tags = ["Old Bridge", "Neretva River", "UNESCO old city"],
  overlay,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const section = root?.querySelector<HTMLElement>(".cinema-scroll");
    if (!root || !section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetScroll = 0;
    let smoothScroll = 0;
    let initialized = false;
    let rafPending = false;

    /* --------------------------------------------------------- helpers -- */

    const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

    const smoothstep = (e0: number, e1: number, v: number) => {
      const x = clamp((v - e0) / (e1 - e0));
      return x * x * (3 - 2 * x);
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const segmentInOut = (s: number, a: number, b: number, c: number, d: number) => {
      const enter = smoothstep(a, b, s);
      const exit = smoothstep(c, d, s);
      return { enter, exit, active: enter * (1 - exit) };
    };

    const getScrollDistance = () =>
      clamp(-section.getBoundingClientRect().top, 0, section.offsetHeight - window.innerHeight);

    /* ---------------------------------------------------------- update -- */

    const set = (name: string, value: string | number) =>
      root.style.setProperty(name, String(value));

    const update = () => {
      rafPending = false;

      targetScroll = getScrollDistance();
      if (!initialized || reduceMotion.matches) {
        smoothScroll = targetScroll;
        initialized = true;
      } else {
        smoothScroll = lerp(smoothScroll, targetScroll, 0.14);
      }
      if (Math.abs(smoothScroll - targetScroll) < 0.08) smoothScroll = targetScroll;

      mouseX = lerp(mouseX, targetMouseX, 0.12);
      mouseY = lerp(mouseY, targetMouseY, 0.12);

      const frame2 = segmentInOut(smoothScroll, 560, 900, 1300, 1620);
      const frame3 = segmentInOut(smoothScroll, 1760, 2140, 2540, 2700);
      const progress = clamp(smoothScroll / 2700);
      // The trip starter arrives once the bazaar panel has left, then holds for
      // the rest of the rig so there is time to actually use it.
      const starterIn = smoothstep(2720, 3080, smoothScroll);
      const introExit = smoothstep(90, 650, smoothScroll);
      const blurActive = clamp(frame2.active + frame3.active);
      const frame2Opacity = frame2.active * (1 - frame3.enter);
      const splitDrift = Math.pow(frame2.enter, 1.5);
      const panel2Opacity = frame2.active * (1 - frame2.exit);
      const panel3Opacity = frame3.active * (1 - frame3.exit);
      const backScale = 0.76 + progress * 0.2 + frame2.enter * 0.18 + frame3.enter * 0.16;
      const sharedHeroY = progress * -74;
      const sharedHeroScale = progress * 0.23;

      set("--mx", reduceMotion.matches ? 0 : mouseX.toFixed(4));
      set("--my", reduceMotion.matches ? 0 : mouseY.toFixed(4));

      set("--back-opacity", (1 - frame2.active * 0.06).toFixed(4));
      set("--back-x", `${(mouseX * -12).toFixed(2)}px`);
      set("--back-y", `${(mouseY * -4).toFixed(2)}px`);
      set("--back-scale", backScale.toFixed(4));
      set("--four-y", `${(10 + progress * 10).toFixed(3)}vh`);
      set("--four-scale", (0.78 + progress * 0.16).toFixed(4));
      set("--bazaar-y", `${(20 - progress * 8).toFixed(3)}vh`);
      set("--blur-px", `${(blurActive * 14).toFixed(2)}px`);
      set("--back-brightness", (1 - blurActive * 0.255).toFixed(4));
      set("--bazaar-blur-px", `${(frame2.active * 14).toFixed(2)}px`);
      set("--bazaar-brightness", (1 - frame2.active * 0.255 - frame3.active * 0.06).toFixed(4));
      set("--bazaar-saturation", (1 + frame3.active * 0.18).toFixed(4));
      set("--shade-opacity", "1");
      set("--shade-z", frame2.active > 0.02 ? "2" : "0");
      set("--shade-top-alpha", (blurActive * 0.465).toFixed(4));
      set("--shade-mid-alpha", (blurActive * 0.42).toFixed(4));
      set("--shade-bottom-alpha", (blurActive * 0.51).toFixed(4));

      set("--title-y", `${(introExit * -210).toFixed(2)}px`);
      set("--title-scale", (1 - introExit * 0.08).toFixed(4));
      set("--title-opacity", (1 - introExit).toFixed(4));

      set("--bridge-x", `calc(-50% + ${(mouseX * 18).toFixed(2)}px)`);
      set("--bridge-y", `${(mouseY * 8 + sharedHeroY - frame2.exit * 760).toFixed(2)}px`);
      set("--bridge-bottom", `${(5 - frame2.enter * 13).toFixed(3)}vh`);
      set("--bridge-width", `${(67.2 + frame2.enter * 37.8).toFixed(3)}vw`);
      set("--bridge-scale", (1.02 + sharedHeroScale + frame2.exit * 0.46).toFixed(4));

      const splitY = (mouseY * 10 + sharedHeroY - splitDrift * 180).toFixed(2);
      const splitScale = (1 + sharedHeroScale + frame2.enter * 0.74).toFixed(4);
      set("--split-left-x", `calc(-50% + ${(-splitDrift * 46).toFixed(3)}vw + ${(mouseX * 22).toFixed(2)}px)`);
      set("--split-left-y", `${splitY}px`);
      set("--split-left-scale", splitScale);
      set("--split-right-x", `calc(-50% + ${(splitDrift * 46).toFixed(3)}vw + ${(mouseX * 22).toFixed(2)}px)`);
      set("--split-right-y", `${splitY}px`);
      set("--split-right-scale", splitScale);

      set("--frame2-opacity", frame2Opacity.toFixed(4));
      set("--frame2-x", `calc(-50% + ${(mouseX * 10).toFixed(2)}px)`);
      set("--frame2-y", `calc(-50% + ${(mouseY * 8 - frame2.exit * 150).toFixed(2)}px)`);
      set("--frame2-scale", (1.06 + frame2.enter * 0.08 + frame2.exit * 0.08).toFixed(4));

      set("--intro-copy-y", `${(introExit * 90).toFixed(2)}px`);
      set("--intro-copy-opacity", (1 - introExit).toFixed(4));
      set("--panel2-opacity", panel2Opacity.toFixed(4));
      set("--panel2-y", `calc(-50% + ${(-frame2.exit * 86 + (1 - frame2.enter) * 58).toFixed(2)}px)`);
      set("--starter-opacity", starterIn.toFixed(4));
      set("--starter-y", `${((1 - starterIn) * 48).toFixed(2)}px`);
      set("--starter-events", starterIn > 0.9 ? "auto" : "none");
      set("--panel3-opacity", panel3Opacity.toFixed(4));
      set("--panel3-y", `calc(-50% + ${(-frame3.exit * 86 + (1 - frame3.enter) * 58).toFixed(2)}px)`);

      if (
        Math.abs(smoothScroll - targetScroll) > 0.08 ||
        Math.abs(mouseX - targetMouseX) > 0.001 ||
        Math.abs(mouseY - targetMouseY) > 0.001
      ) {
        requestTick();
      }
    };

    function requestTick() {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(update);
    }

    /* ------------------------------------------------------- listeners -- */

    const onScroll = () => requestTick();
    const onResize = () => requestTick();
    const onPointerMove = (event: PointerEvent) => {
      targetMouseX = event.clientX / window.innerWidth - 0.5;
      targetMouseY = event.clientY / window.innerHeight - 0.5;
      requestTick();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    requestTick();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div ref={rootRef} className="cinema-root">
      <section className="cinema-scroll" id="cinema" aria-label={`${title} cinematic scroll story`}>
        <div className="stage">
          <div className="world">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="scene-img sky-img" alt="" src={ASSET.sky} />

            <div className="back-stack">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="scene-img back-img back-four" alt="" src={ASSET.backFour} />
              {/* The bazaar layer is footage rather than a still, so the river
                  keeps moving behind the story. Muted and looping — it is
                  scenery, not content, so it never asks for sound and never
                  needs controls. */}
              <video
                className="scene-img back-img back-bazaar motion-reduce:hidden"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={ASSET.bazaar}
                aria-hidden="true"
              >
                <source src="/videos/mostar-river.mp4" type="video/mp4" />
              </video>
              {/* Reduced motion keeps the original still. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="scene-img back-img back-bazaar hidden motion-reduce:block"
                alt=""
                src={ASSET.bazaar}
              />
            </div>

            <h1 className="hero-title">{title}</h1>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="scene-img splitframe-img splitframe-left" alt="" src={ASSET.splitLeft} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="scene-img splitframe-img splitframe-right" alt="" src={ASSET.splitRight} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="scene-img bridge-img" alt="" src={ASSET.bridge} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="scene-img frame-two-img" alt="" src={ASSET.frameTwo} />

            <div className="shade" />
          </div>

          <section className="intro-copy" aria-label={`${title} overview`}>
            <p>{intro}</p>
            <div className="hero-tags" aria-label={`${title} highlights`}>
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </section>

          {overlay}

          <section className="story-panel story-panel-bridge" id="bridge" aria-label="Old Bridge details">
            <h2>The bridge is the city&rsquo;s compass.</h2>
            <p>
              Stari Most links the banks of the Neretva and anchors a historic quarter shaped by
              Ottoman, Mediterranean, and European layers.
            </p>
            <dl className="facts">
              <div>
                <dt>1566</dt>
                <dd>Original bridge completed</dd>
              </div>
              <div>
                <dt>2005</dt>
                <dd>Old Bridge Area inscribed by UNESCO</dd>
              </div>
            </dl>
          </section>

          <section className="story-panel story-panel-bazaar" id="bazaar" aria-label="Old town details">
            <h2>The bazaar keeps Mostar close.</h2>
            <p>
              Stone lanes, mosque courtyards, copper stalls, and riverside coffee stay within a
              short walk of Stari Most.
            </p>
            <button type="button" className="note-button">
              <span aria-hidden="true">&#8599;</span>
              <span>Open old town notes</span>
            </button>
          </section>
        </div>
      </section>
    </div>
  );
}
