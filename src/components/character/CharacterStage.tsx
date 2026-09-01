"use client";

import { AnimatePresence, motion } from "motion/react";
import { InteractiveCharacter } from "./InteractiveCharacter";
import { CHARACTERS, type CharacterId } from "./characters";

/**
 * CHARACTER STAGE
 *
 * Holds whichever character the traveller's answer resolves to, and owns the
 * arrival and departure. Keyed on the character id, so switching answers
 * exchanges one character for another rather than mutating one in place.
 *
 * The whole figure is positioned by the caller. What lives here is only the
 * pop-in: a spring, not a duration, because a spring settles at slightly
 * different times per property and that is what stops the arrival reading as
 * a canned animation. Stiffness and damping are tuned to land just short of
 * overshoot — the character should arrive with some weight, not bounce.
 */

/**
 * Each box holds its asset's own aspect ratio, so nobody is stretched, and
 * every box has to fit the left gutter — from the character's own inset to
 * where the widest step's card begins, which is about 320px at 1296. Friends
 * is the constraint: five abreast is a wide, short picture, so it is the one
 * that has to give up height to keep everybody on screen.
 */
const SIZING: Record<CharacterId, string> = {
  couple: "h-[42vh] w-[21vh] min-h-[230px] min-w-[116px]",
  family: "h-[38vh] w-[35vh] min-h-[210px] min-w-[192px]",
  friends: "h-[23vh] w-[33vh] min-h-[145px] min-w-[210px]",
  soloBoy: "h-[42vh] w-[14vh] min-h-[230px] min-w-[77px]",
  soloGirl: "h-[42vh] w-[15vh] min-h-[230px] min-w-[83px]",
};

export function CharacterStage({
  character,
  className,
}: {
  character: CharacterId | undefined;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={className}>
      <AnimatePresence mode="wait">
        {character && (
          <motion.div
            key={character}
            initial={{ opacity: 0, scale: 0.75, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            // Leaving is quicker and plainer than arriving. A character that
            // exits with the same spring it entered with looks like it was
            // yanked offstage.
            exit={{ opacity: 0, scale: 0.92, y: 12, transition: { duration: 0.22 } }}
            transition={{ type: "spring", stiffness: 180, damping: 18, mass: 0.8 }}
            style={{ transformOrigin: "50% 100%" }}
          >
            <InteractiveCharacter character={character} className={SIZING[character]} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Re-exported so callers need only this module. */
export { CHARACTERS };
export type { CharacterId };
