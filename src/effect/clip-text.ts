import { css, type CSSResultGroup, cssvarValues, define, property } from "../deps.js";
import { htmlSlot, type HTMLTemplate } from "../tmpl.js";
import EffectSTD from "./std.js";

const defineName = "clip-text";

@define(defineName)
export class ClipText extends EffectSTD {
  @property() text = "";
  static styles = [
    EffectSTD.styles,
    css`
      :host {
        background: linear-gradient(180deg, var(${cssvarValues.text}), rgb(var(${cssvarValues.textRGB}) / 64%));
        color: transparent;
        -webkit-background-clip: text !important;
        background-clip: text !important;
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
