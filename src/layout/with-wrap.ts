import { css, property } from "../deps.js";
import { htmlSlot, type HTMLTemplate } from "../lib/templates.js";
import { define } from "../root.js";
import LayoutSTD from "./std.js";

const defineName = "with-wrap";

@define(defineName)
export class WithWrap extends LayoutSTD {
  /**
   * Slot name.
   */
  @property() with = "";

  static styles = css`
    :host {
      display: contents;
    }
  `;

  protected render(): HTMLTemplate {
    return htmlSlot(this.with);
  }
}

export default WithWrap;

declare global {
  interface HTMLElementTagNameMap {
    "with-wrap": WithWrap;
  }
}
