import { css, define, html, property } from "../deps.js";
import { htmlSlot } from "../tmpl.js";
import LayoutSTD from "./std.js";

@define("flex-flow")
export class FlexFlow extends LayoutSTD {
  @property() flexflow = "row nowrap column nowrap";
  @property() m = "720px";
  static styles = css`
    :host {
      display: flex !important;
    }
  `;

  render() {
    const flexflow = this.flexflow.split(/\s+/);
    const style = `:host{flex-direction:${flexflow[0] || "row"};flex-wrap:${flexflow[1] || "nowrap"};}@media(max-width: ${this.m || "720px"}){:host{flex-direction:${flexflow[2] || flexflow[0] || "column"};flex-wrap:${flexflow[3] || flexflow[1] || "nowrap"}}`;
    return html`${htmlSlot()}
      <style>
        ${style}
      </style>`;
  }
}

export default FlexFlow;
declare global {
  interface HTMLElementTagNameMap {
    "flex-flow": FlexFlow;
  }
}
