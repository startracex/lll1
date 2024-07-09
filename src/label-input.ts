import LabelInput from "./web-components/input/label-input.js";
LabelInput.define();
export default LabelInput;
export * from "./web-components/input/label-input.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-label-input": LabelInput;
  }
}
