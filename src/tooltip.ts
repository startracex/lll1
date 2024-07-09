import Tooltip from "./web-components/tooltip/tooltip.js";
Tooltip.define();
export default Tooltip;
export * from "./web-components/tooltip/tooltip.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-tooltip": Tooltip;
  }
}
