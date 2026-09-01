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
 * THE RESERVED COLUMN
 *
 * The character used to be dropped into the left gutter at a fixed inset and
 * simply hoped to miss the interface. It did not: the option rail runs the
 * full width of the stage, so the figure's feet landed on the first two cards
 * and it looked like they were standing on them.
 *
 * So the column is declared here instead of guessed. `COLUMN` is the width
 * each character reserves, and the starter reads the same number to pad its
 * own content across. One constant drives both, which is the only way the two
 * can be guaranteed not to overlap — and it also means a character can be as
 * large as it needs to be without anything having to be nudged by hand.
 *
 * The widths differ per character because the artwork does. A solo figure is
 * a narrow portrait; five friends abreast is a wide, short picture, and
 * forcing it into a portrait column is what made it look shrunken next to the
 * others. It gets the widest column instead.
 */

/** Width each character reserves at the left of the stage, in px. */
export const COLUMN: Record<CharacterId, number> = {
  couple: 250,
  family: 340,
  friends: 440,
  soloBoy: 210,
  soloGirl: 220,
};

/**
 * Heights are chosen so every party has similar presence. Widths follow from
 * each asset's own aspect and must stay inside its column.
 */
const SIZING: Record<CharacterId, string> = {
  // 506x1000 — portrait.
  couple: "h-[46vh] w-[23.3vh] min-h-[300px] min-w-[152px]",
  // 1000x1095 — nearly square.
  family: "h-[42vh] w-[38.4vh] min-h-[280px] min-w-[256px]",
  // 1300x896 — wide and short, so it earns its height through width.
  friends: "h-[29vh] w-[42vh] min-h-[195px] min-w-[283px]",
  // 335x1000 and 363x1000 — narrow portraits.
  soloBoy: "h-[48vh] w-[16.1vh] min-h-[310px] min-w-[104px]",
  soloGirl: "h-[48vh] w-[17.4vh] min-h-[310px] min-w-[113px]",
};

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
      // The stage IS the reserved column, so the figure is centred in exactly
      // the space the starter padded itself clear of.
      style={{ width: character ? COLUMN[character] : 0 }}
    >
      <AnimatePresence mode="wait">
        {character && (
          <motion.div
            key={character}
            initial={{ opacity: 0, scale: 0.75, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            // Leaving is quicker and plainer than arriving. A character that
            // exits with the same spring it entered with looks yanked offstage.
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

export { CHARACTERS };
export type { CharacterId };
