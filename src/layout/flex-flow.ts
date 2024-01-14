import { css, define, html, property } from "../deps.js";
import { htmlSlot, htmlStyle, type HTMLTemplate } from "../tmpl.js";
import LayoutSTD from "./std.js";

const defineName = "flex-flow";

@define(defineName)
export class FlexFlow extends LayoutSTD {
  @property() flexflow = "row nowrap column nowrap";
  @property() m = "720px";
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
    const m = this.m || "720px";
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
