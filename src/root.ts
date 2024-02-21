import { css, type CSSResult, type CSSResultGroup, unsafeCSS } from "lit";

import { conf } from "./conf.js";
import GodownElement from "./godown-element.js";

/**
 * {@linkcode conf.define} a custom element.
 * @param name Name for the new custom element. Must be a valid custom element name.
 * @param options Object that controls how the element is defined.
 */
export const define = (name?: string, options?: ElementDefinitionOptions) => (constructor: CustomElementConstructor) => {
  conf.define(name, constructor, options);
};

const scopeString = "--";

/**
 * Custom CSS variable prefix, join with "--".
 */
export const cssvar = unsafeCSS(scopeString + conf.cssvar.replace(/[^a-zA-Z0-9\\-]/g, ""));

export function createScope(scope: string): CSSResult {
  return joinScope(conf.tag(scope));
}

function joinScope(s: string) {
  return unsafeCSS(cssvar + scopeString + s);
}

export const cssvarValues = {
  cssvar,
  input: joinScope("input"),
  main: joinScope("background"),
  text: joinScope("foreground"),
  mainRGB: joinScope("background-rgb"),
  textRGB: joinScope("foreground-rgb"),
};

GodownElement.conf = conf;

GodownElement.styles = [
  css`
    :host {
      ${cssvar}--background-rgb: 12 12 12;
      ${cssvar}--background: rgb(var(${cssvarValues.mainRGB}));
      ${cssvar}--foreground-rgb: 240 240 240;
      ${cssvar}--foreground: rgb(var(${cssvarValues.textRGB}));
      ${cssvar}--clip-background:linear-gradient(180deg, var(${cssvarValues.text}), rgb(var(${cssvarValues.textRGB}) / 68%));
      ${cssvar}--size: 100%;
      ${cssvar}--accept: rgb(25 130 180);
      font-size: var(${cssvar}--size);
    }
  `,
  css`
    :host {
      ${cssvarValues.input}--width: 10em;
      ${cssvarValues.input}--height: 1.6em;
      ${cssvarValues.input}--background: var(${cssvarValues.main});
      ${cssvarValues.input}--true: rgb(48 132 240);
      ${cssvarValues.input}--false: rgb(198 198 198);
      ${cssvarValues.input}--control:var(${cssvarValues.text});
      ${cssvarValues.input}--control-edge: var(${cssvarValues.input}--true);
      ${cssvarValues.input}--outline-color: var(${cssvar}--accept);
      ${cssvarValues.input}--outline-width: .15em;
      ${cssvarValues.input}--outline-style: solid;
      ${cssvarValues.input}--outline: var(${cssvarValues.input}--outline-width)  var(${cssvarValues.input}--outline-style) var(${cssvarValues.input}--outline-color);
      ${cssvarValues.input}--radius: 0.2em;
    }
  `,
  css`
    * {
      font-size: 100%;
      font-style: normal;
      color: inherit;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      border: 0;
      outline: 0;
    }

    ::selection {
      ${cssvar}--text-selection--color: inherit;
      ${cssvar}--text-selection--background: none;
      color: var(${cssvar}--text-selection--color);
      background: var(${cssvar}--text-selection--background);
    }
  `,
] as CSSResultGroup;

GodownElement.disableWarning?.("change-in-update");

export { GodownElement };
