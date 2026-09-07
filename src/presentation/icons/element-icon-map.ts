/*
 * Element-name -> icon component lookup. Kept out of `index.tsx` (a React
 * Fast Refresh boundary — every export there must be a component) since
 * this is a plain object, not a component. Import it directly:
 * `import { ELEMENT_ICONS } from "../presentation/icons/element-icon-map.ts"`.
 */
import {
  ElementCosmicIcon,
  ElementDarkIcon,
  ElementDragonIcon,
  ElementEarthIcon,
  ElementElectricIcon,
  ElementFairyIcon,
  ElementFireIcon,
  ElementGhostIcon,
  ElementGrassIcon,
  ElementIceIcon,
  ElementLightIcon,
  ElementNormalIcon,
  ElementPoisonIcon,
  ElementPsychicIcon,
  ElementSteelIcon,
  ElementWaterIcon,
  ElementWindIcon,
} from "./index.tsx";

export const ELEMENT_ICONS = {
  fire: ElementFireIcon,
  water: ElementWaterIcon,
  electric: ElementElectricIcon,
  grass: ElementGrassIcon,
  earth: ElementEarthIcon,
  poison: ElementPoisonIcon,
  normal: ElementNormalIcon,
  ice: ElementIceIcon,
  fairy: ElementFairyIcon,
  wind: ElementWindIcon,
  steel: ElementSteelIcon,
  psychic: ElementPsychicIcon,
  light: ElementLightIcon,
  dark: ElementDarkIcon,
  ghost: ElementGhostIcon,
  dragon: ElementDragonIcon,
  cosmic: ElementCosmicIcon,
} as const;
