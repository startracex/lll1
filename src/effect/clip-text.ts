import { css, define, property } from "../deps.js";
import EffectSTD from "./std.js";
import { htmlSlot } from "../tmpl.js";

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

  render() {
    return this.text || htmlSlot();
  }
}

export default ClipText;

declare global {
  interface HTMLElementTagNameMap {
    "clip-text": ClipText;
  }
}
