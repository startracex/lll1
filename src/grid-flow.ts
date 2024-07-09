import GridFlow from "./web-components/layout/grid-flow.js";
GridFlow.define();
export default GridFlow;
export * from "./web-components/layout/grid-flow.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-grid-flow": GridFlow;
  }
}
