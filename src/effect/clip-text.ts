import { createScope, css, type CSSResultGroup, cssvar, define, property } from "../deps.js";
import { htmlSlot, type HTMLTemplate } from "../tmpl.js";
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
