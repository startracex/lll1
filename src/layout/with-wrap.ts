import { css, define, property } from "../deps.js";
import { htmlSlot } from "../tmpl.js";
import LayoutSTD from "./std.js";

@define("with-wrap")
export class WithWrap extends LayoutSTD {
  @property() with = "";
  static styles = css`
    :host {
      display: contents;
    }
  `;

  render() {
    return htmlSlot(this.with);
  }
}

export default WithWrap;

declare global {
  interface HTMLElementTagNameMap {
    "with-wrap": WithWrap;
  }
}
