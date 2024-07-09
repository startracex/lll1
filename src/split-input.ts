import SplitInput from "./web-components/input/split-input.js";
SplitInput.define();
export default SplitInput;
export * from "./web-components/input/split-input.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-split-input": SplitInput;
  }
}
