import { css, define, property } from "../deps.js";
import { htmlSlot, type HTMLTemplate } from "../tmpl.js";
import EffectSTD from "./std.js";

@define("clip-text")
export class ClipText extends EffectSTD {
  @property() text = "";
  static styles = css`
    :host {
      color: transparent;
      background: linear-gradient(90deg, #000, #fff);
      -webkit-background-clip: text !important;
      background-clip: text !important;
    }
  `;

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
