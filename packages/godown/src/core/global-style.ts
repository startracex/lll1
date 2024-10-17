import { type Gradients, presetsRGB } from "@godown/colors/presets-rgb.js";
import { travel } from "@godown/colors/travel.js";
import GodownElement from "@godown/element";
import GodownConfig from "@godown/element/config.js";
import { trim } from "@godown/element/tools/lib.js";
import { css, CSSResult, unsafeCSS } from "lit";

GodownElement.godownConfig ||= new GodownConfig();

export class GlobalStyle extends GodownElement {
}

const cssvar = trim(GlobalStyle.godownConfig.prefix, "-");

export function scopePrefix(scope: string, len = 1) {
  return variablePrefix(cssvar + "-".repeat(len) + scope);
}

export function variablePrefix(variable: string) {
  return unsafeCSS("--" + variable);
}

export const cssGlobalVars = {
  foreground: scopePrefix("foreground", 2),
  background: scopePrefix("background", 2),
  clipBackground: scopePrefix("clip-background", 2),
  active: scopePrefix("active", 2),
  passive: scopePrefix("passive", 2),
  _colors: {} as PresetsGradientsCSSResult,
  input: scopePrefix("input", 2),
  white: scopePrefix("color-white", 2),
  black: scopePrefix("color-black", 2),
};

type PresetsGradientsCSSResult = Record<keyof typeof presetsRGB, Gradients<CSSResult>>;
GlobalStyle.styles = [
  unsafeCSS(
    ":host{"
      + `${cssGlobalVars.black}:rgb(0 0 0);`
      + `${cssGlobalVars.white}:rgb(255 255 255);`
      + travel((key, gradient, rgb) => {
        cssGlobalVars._colors[key] ||= [] as any;
        cssGlobalVars._colors[key].push(unsafeCSS(scopePrefix("color", 2) + "-" + key + "-" + gradient));
        const endKey = `-${key}-${gradient}`;
        const colorKey = scopePrefix("color", 2) + endKey;
        return `${colorKey}:rgb(${rgb});`;
      }, presetsRGB).join("")
      + "}",
  ),
  css`
    :host {
      ${cssGlobalVars.background}: var(${cssGlobalVars._colors.darkgray[9]});
      ${cssGlobalVars.foreground}: var(${cssGlobalVars._colors.lightgray[0]});
      ${cssGlobalVars.active}: var(${cssGlobalVars._colors.blue[6]});
      ${cssGlobalVars.passive}: var(${cssGlobalVars._colors.darkgray[6]});
      ${cssGlobalVars.clipBackground}: linear-gradient(180deg, var(${cssGlobalVars.foreground}), var(${cssGlobalVars.passive}));
    }
  `,
  css`
    * {
      border: 0;
      outline: 0;
      margin: 0;
      padding: 0;
      font-size: 100%;
      font-style: normal;
      box-sizing: border-box;
    }

    :host {
      box-sizing: border-box;
    }

    a {
      text-decoration: none;
    }

    span {
      white-space: nowrap;
    }

    svg {
      user-select: none;
    }
  `,
];
