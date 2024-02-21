import { css, html, property } from "../../deps.js";
import { htmlSlot, htmlStyle, type HTMLTemplate } from "../../lib/templates.js";
import { define, GodownElement } from "../../root.js";

const defineName = "flex-flow";

/**
 * FlexFlow controls the flex layout based on the width of the screen.
 */
@define(defineName)
export class FlexFlow extends GodownElement {
  /**
   * The flex-flow behavior.
   */
  @property() flexflow = "row nowrap column nowrap";
  /**
   * The width of the screen for the position change.
   */
  @property() mobile = "720px";

  static styles = [
    css`
      :host {
        display: flex !important;
      }
    `,
  ];

  protected render(): HTMLTemplate {
    const flexflow = this.flexflow.split(/\s+/);
    const flexDirection = flexflow[0] || "row";
    const flexWrap = flexflow[1] || "nowrap";
    const flexDirectionM = flexflow[2] || flexDirection || "column";
    const flexWrapM = flexflow[3] || flexWrap || "nowrap";
    const m = this.mobile || "720px";
    const style = `:host{flex-direction:${flexDirection};flex-wrap:${flexWrap};}@media(max-width: ${m}){:host{flex-direction:${flexDirectionM};flex-wrap:${flexWrapM}}`;
    return html`${htmlSlot()} ${htmlStyle(style)}`;
  }
}

export default FlexFlow;
declare global {
  interface HTMLElementTagNameMap {
    "flex-flow": FlexFlow;
  }
}
