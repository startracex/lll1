import RangeInput from "./web-components/input/range-input.js";
RangeInput.define();
export default RangeInput;
export * from "./web-components/input/range-input.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-range-input": RangeInput;
  }
}
