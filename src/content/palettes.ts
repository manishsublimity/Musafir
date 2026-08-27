import type { ScenePalette, SceneArchetype } from "@/lib/types";

/**
 * Palettes for the generated cinematic scenes.
 *
 * These exist so that a destination without a supplied photograph still renders
 * as considered, original artwork rather than a grey box. Each palette is tuned
 * to the light of the place — the Maldives at noon, Ladakh at altitude, Dubai at
 * dusk — so the rails read as a set of real locations rather than as swatches.
 */
export const scenePalettes: Record<SceneArchetype, ScenePalette> = {
  island: {
    sky: ["#0b3d4d", "#1f7f8c", "#7fd4d0"],
    land: ["#0d5c5f", "#14807a", "#e8dcc0"],
    glow: "#ffd9a0",
  },
  beach: {
    sky: ["#1a2f52", "#c86a4a", "#f5b072"],
    land: ["#2b3f52", "#8a6f57", "#e6d5b8"],
    glow: "#ffcf8f",
  },
  mountain: {
    sky: ["#131c33", "#3b4a70", "#c98f6a"],
    land: ["#1a2338", "#2e3d54", "#5a6b7d"],
    glow: "#f3c08a",
  },
  snow: {
    sky: ["#16233d", "#3f5a80", "#a8c4dd"],
    land: ["#243349", "#48607d", "#dfe9f2"],
    glow: "#ffe6c4",
  },
  desert: {
    sky: ["#2a1a2e", "#7d3f3a", "#e59a54"],
    land: ["#4a2c22", "#8c5a34", "#d9a463"],
    glow: "#ffcf7a",
  },
  city: {
    sky: ["#0e1526", "#243a5c", "#c07a4e"],
    land: ["#111a2b", "#1d2b42", "#2f4258"],
    glow: "#ffc98a",
  },
  forest: {
    sky: ["#0d1f1c", "#1f4436", "#87b07a"],
    land: ["#0f2a22", "#1c4433", "#3d6b4a"],
    glow: "#e2f0b8",
  },
  backwater: {
    sky: ["#12261f", "#2e5c43", "#c9b877"],
    land: ["#143026", "#245039", "#7fa06a"],
    glow: "#f2d894",
  },
  heritage: {
    sky: ["#2b1524", "#7a3448", "#e0904f"],
    land: ["#3d2028", "#7d4436", "#c98a5c"],
    glow: "#ffc27a",
  },
  reef: {
    sky: ["#062b3d", "#0f6b84", "#4fc4c9"],
    land: ["#0a4a55", "#12868a", "#8fe0d4"],
    glow: "#c9f5e8",
  },
  aurora: {
    sky: ["#050b1c", "#123049", "#2f8f7a"],
    land: ["#08111f", "#12213a", "#2c3f57"],
    glow: "#87f5c4",
  },
  savannah: {
    sky: ["#2e1c14", "#8a4a26", "#e0a154"],
    land: ["#3f2a18", "#7a5a2e", "#c9a457"],
    glow: "#ffd28a",
  },
};

export function paletteFor(scene: SceneArchetype): ScenePalette {
  return scenePalettes[scene];
}
