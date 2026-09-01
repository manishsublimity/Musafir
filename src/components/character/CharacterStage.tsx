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
 * The most a character may take from the left before it would reach centred
 * content. The upper bound is not arbitrary: it is what puts the friends
 * group about 30% wider than it was.
 */
const MAX_COLUMN = "clamp(170px, calc(50vw - 290px), 590px)";

/** The box every character is fitted into. */
const STAGE_HEIGHT = "46vh";

/**
 * What a given character actually occupies.
 *
 * The cap above is the same for everyone, but the artwork is not: fitted into
 * a box that tall, a solo traveller is a sliver and five friends abreast fill
 * it. Reserving the cap for all of them would have a lone figure holding back
 * 358px of layout to stand in 116px of it — and the option rail is centred
 * inside whatever is left, so that space is not free, it comes straight out of
 * how many destinations you can see at once.
 *
 * So each character reserves the narrower of the cap and its own fitted width.
 */
export function columnFor(character: CharacterId): string {
  const { width, height } = CHARACTERS[character];
  const aspect = width / height;
  return `min(${MAX_COLUMN}, calc(${STAGE_HEIGHT} * ${aspect.toFixed(4)}))`;
}

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
      // The stage IS the column, so the figure occupies exactly the space the
      // rail was told to keep clear.
      style={{ width: character ? columnFor(character) : 0, height: STAGE_HEIGHT }}
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
