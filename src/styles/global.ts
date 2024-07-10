import { css, CSSResult, unsafeCSS } from "lit";

import conf from "../conf.js";
import { presetsRGB } from "./colors/presetsRGB.js";

const cssvar = unsafeCSS(conf.cssvar);

export function createScope(scope: string, len = 1): CSSResult {
  return unsafeCSS(cssvar + "-".repeat(len) + scope);
}

function globalScope(scope: string) {
  return createScope(scope, 2);
}

export const cssGlobalVars = {
  color: globalScope("color"),
  colorRGB: globalScope("color-rgb"),
  foreground: globalScope("foreground"),
  foregroundRGB: globalScope("foreground-rgb"),
  background: globalScope("background"),
  backgroundRGB: globalScope("background-rgb"),
  clipBackground: globalScope("clip-background"),
  input: globalScope("input"),
  active: globalScope("active"),
  passive: globalScope("passive"),
};

export const colorValues = {} as Record<
  keyof typeof presetsRGB,
  Record<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, CSSResult>
>;
export const colorRGBValues = {} as typeof colorValues;

const colorsToCSS = Object.entries(presetsRGB).reduce((acc, [key, values]) => {
  for (let i = 0; i < values.length; i++) {
    const endKey = `-${key}-${i}`;
    const colorKey = `--${cssGlobalVars.color}` + endKey;
    const rgbKey = `--${cssGlobalVars.colorRGB}` + endKey;
    colorValues[key] ||= {};
    colorValues[key][i] = unsafeCSS(`var(${colorKey})`);
    colorRGBValues[key] ||= {};
    colorRGBValues[key][i] = unsafeCSS(`var(${rgbKey})`);
    acc = colorKey + `:rgb(var(${rgbKey}));` + acc + rgbKey + `:${values[i]};`;
  }
  return acc;
}, "");

export const globalStyles = [
  unsafeCSS(`:host{${colorsToCSS}}`),
  css`
    :host {
      --${cssGlobalVars.backgroundRGB}: ${colorRGBValues.darkgray[9]};
      --${cssGlobalVars.background}: rgb(var(--${cssGlobalVars.backgroundRGB}));
      --${cssGlobalVars.foregroundRGB}: ${colorRGBValues.lightgray[0]};
      --${cssGlobalVars.foreground}: rgb(var(--${cssGlobalVars.foregroundRGB}));
      --${cssGlobalVars.active}: ${colorValues.blue[6]};
      --${cssGlobalVars.passive}: ${colorValues.darkgray[2]};
      --${cssGlobalVars.clipBackground}: linear-gradient(180deg, rgb(var(--${cssGlobalVars.foregroundRGB})), rgb(var(--${cssGlobalVars.foregroundRGB}) / 68%));
      --${cssvar}--selection-color: inherit;
      --${cssvar}--selection-background: none;
      box-sizing: border-box;
    }
  `,
  css`
    * {
      border: 0;
      outline: 0;
      margin: 0;
      padding: 0;
      color: inherit;
      height: inherit;
      font-size: 100%;
      font-style: normal;
      box-sizing: border-box;
    }
    a {
      text-decoration: none;
    }
    span {
      white-space: nowrap;
    }
    ::selection {
      color: var(--${cssvar}--selection-color);
      background: var(--${cssvar}--selection-background);
    }
  `,
];
