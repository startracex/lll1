import FlexFlow from "./web-components/layout/flex-flow.js";
FlexFlow.define();
export default FlexFlow;
export * from "./web-components/layout/flex-flow.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-flex-flow": FlexFlow;
  }
}
