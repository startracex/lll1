import { presetsRGB } from "./presetsRGB.js";

export const presets = {} as typeof presetsRGB;
Object.entries(presetsRGB).forEach(([key, values]) => {
  presets[key] = values.map((value) => `rgb(${value})`);
});
