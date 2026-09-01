"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Scene } from "@/components/media/Scene";
import type { DestinationCard } from "@/lib/view-models";

/**
 * DESTINATION BACKDROP
 *
 * Once a destination is chosen the hero stops being Mostar and becomes the
 * place the traveller picked. It cross-fades in over the cinematic scene and
 * stays for the rest of the flow, so the remaining questions are answered
 * against the trip being planned rather than against a town in Bosnia.
 *
 * ---------------------------------------------------------------------------
 * WHAT EACH DESTINATION ACTUALLY SHOWS
 *
 * Five of the eighteen have real photography — Bali, the Maldives, Dubai,
 * Switzerland and Japan. The other thirteen have the generated scene artwork
 * the rest of the site falls back to.
 *
 * This renders whichever the destination actually has, and that distinction
 * matters more here than anywhere else on the site. Filling the whole hero
 * with a stock beach and calling it Kerala would be a claim about a place we
 * have no picture of; the generated scene is unmistakably artwork, so it can
 * stand in without pretending to be a photograph. The rule is the same one
 * `Media` follows everywhere else: prefer the real `src`, fall back to the
 * scene, never invent.
 *
 * ---------------------------------------------------------------------------
 * WHY IT SITS WHERE IT DOES
 *
 * z-9: above every layer of the Mostar scene, which it replaces, and below
 * the stage's foot gradient at z-10. That ordering is deliberate — the
 * gradient is what keeps the questions legible, and it has to darken this
 * backdrop too, not sit uselessly beneath it.
 *
 * Opacity is multiplied by the starter's own, so a backdrop can never outlive
 * the panel that selected it: scrolling back up to the story takes the
 * destination away with everything else.
 */
export function DestinationBackdrop({ destination }: { destination?: DestinationCard }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[9] overflow-hidden"
      style={{ opacity: "var(--starter-opacity, 0)" }}
    >
      <AnimatePresence mode="sync">
        {destination && (
          <motion.div
            key={destination.slug}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* A slow drift, so the hero is never a static plate. It runs once
                rather than looping: a backdrop that keeps rescaling forever
                pulls attention away from the question in front of it. */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.09 }}
              animate={{ scale: 1 }}
              transition={{ duration: 9, ease: [0.16, 1, 0.3, 1] }}
            >
              {destination.image ? (
                <Image
                  src={destination.image}
                  alt=""
                  fill
                  sizes="100vw"
                  priority={false}
                  className="object-cover"
                />
              ) : (
                // Thrown out of focus on purpose. At card size the scene reads
                // as illustration; blown up to fill a hero it reads as flat
                // vector art competing with the panel in front of it. Blurred,
                // it becomes atmosphere — the colour and shape of the place
                // rather than a picture of it — which is both the better
                // backdrop and the more honest one, since it could not be
                // mistaken for photography of somewhere we have none.
                <Scene
                  scene={destination.scene}
                  seed={`hero-backdrop-${destination.slug}`}
                  className="size-full scale-110 blur-2xl"
                />
              )}
            </motion.div>

            {/* The photographs are 940–1376px wide, so full bleed on a large
                display is softer than the Mostar footage it replaces. A light
                wash evens that out and settles the picture behind the panel
                rather than letting it compete with it. */}
            <div className="absolute inset-0 bg-ink-900/25" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
