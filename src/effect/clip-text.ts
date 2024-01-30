import { createScope, cssvar, define } from "../root.js";
import { css, type CSSResultGroup, property } from "../deps.js";
import { htmlSlot, type HTMLTemplate } from "../lib/templates.js";
import EffectSTD from "./std.js";

const defineName = "clip-text";
const cssvarScope = createScope(defineName);

@define(defineName)
export class ClipText extends EffectSTD {
  @property() text = "";
  static styles = [
    EffectSTD.styles,
    css`
      :host {
        ${cssvarScope}--clip-background: var(${cssvar}--clip-background);
        background: var(${cssvarScope}--clip-background);
        color: transparent;
        -webkit-text-fill-color: transparent;
        background-clip: text !important;
        -webkit-background-clip: text !important;
        display: inline-flex;
      }
    `,
  ] as CSSResultGroup;

  protected render(): HTMLTemplate | string {
    return this.text || htmlSlot();
  }
}

export default ClipText;

declare global {
  interface HTMLElementTagNameMap {
    "clip-text": ClipText;
  }
}
