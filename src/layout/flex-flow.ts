import { html, css, property, define } from "../deps.js";
import STD from "./std.js";
@define("flex-flow")
export class FlexFlow extends STD {
  @property() flexflow = "row nowrap column nowrap";
  @property() m = "720px";
  static styles = css`
    :host {
      display: flex !important;
    }
  `;
  render() {
    const flexflow = this.flexflow.split(/\s+/);
    const style = `:host{flex-direction:${flexflow[0] || "row"};flex-wrap:${flexflow[1] || "nowrap"};}@media(max-width: ${this.m || "720px"}){:host{flex-direction:${flexflow[2] || flexflow[0] || "colom"};flex-wrap:${flexflow[3] || flexflow[1] || "nowrap"}}`;
    return html`<slot></slot>
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
