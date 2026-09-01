"use client";

import { AnimatePresence, motion } from "motion/react";
import { InteractiveCharacter } from "./InteractiveCharacter";
import { CHARACTERS, type CharacterId } from "./characters";

/**
 * CHARACTER STAGE
 *
 * Holds whichever character the answer resolves to, and owns the arrival and
 * departure. Keyed on the character id, so switching answers exchanges one
 * character for another rather than mutating one in place.
 *
 * ---------------------------------------------------------------------------
 * THE COLUMN, AND WHY IT IS A FORMULA
 *
 * The character stands at the left while the panel stays centred on the full
 * width. Those two facts constrain each other: the character has to end before
 * the centred content begins, or the heading runs straight across somebody's
 * chest.
 *
 * The constraint was measured rather than guessed. Rendering every question in
 * the flow at its real size, the widest — "How many rooms does your group
 * need?" — is 519px, so the content reaches 260px either side of the middle;
 * the room picker's own panel is 512px, which lands in the same place. Add a
 * little air and the character has to stop 290px short of centre.
 *
 * That threshold moves with the viewport, because the text width barely
 * changes but the middle does — so a fixed column is right at exactly one size
 * and wrong everywhere else. A 572px column is comfortable at 1900 and puts
 * the heading through the artwork at 1296.
 *
 * Hence one expression, `50vw - 290px`, clamped at both ends. Checked across
 * 1024, 1280, 1296, 1536 and 1900: the figure clears the content at every one,
 * with about 20px to spare at the tightest.
 *
 * ---------------------------------------------------------------------------
 * ONE BOX FOR EVERY CHARACTER
 *
 * There is no per-character sizing table any more. Every character gets the
 * same box and `object-contain` does the fitting, which is what keeps them
 * consistent: five friends abreast fill the width and come out short, a solo
 * traveller fills the height and comes out narrow. Neither can be stretched,
 * and neither can end up looking shrunken beside the others, because neither
 * has its own hand-tuned numbers left to drift.
 */

/**
 * Left edge to where the centred content begins. The upper bound is not
 * arbitrary: it is what puts the friends group about 30% wider than it was.
 */
export const COLUMN = "clamp(170px, calc(50vw - 290px), 590px)";

export function CharacterStage({
  character,
  className,
}: {
  character: CharacterId | undefined;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      // The stage IS the column, so the figure occupies exactly the space an
      // overflowing rail was told to start after.
      style={{ width: character ? COLUMN : 0, height: "46vh" }}
    >
      <AnimatePresence mode="wait">
        {character && (
          <motion.div
            key={character}
            className="size-full"
            initial={{ opacity: 0, scale: 0.75, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            // Leaving is quicker and plainer than arriving. A character that
            // exits with the same spring it entered with looks yanked offstage.
            exit={{ opacity: 0, scale: 0.92, y: 12, transition: { duration: 0.22 } }}
            transition={{ type: "spring", stiffness: 180, damping: 18, mass: 0.8 }}
            style={{ transformOrigin: "50% 100%" }}
          >
            <InteractiveCharacter character={character} className="size-full" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { CHARACTERS };
export type { CharacterId };
