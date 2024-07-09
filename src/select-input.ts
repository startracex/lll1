import SelectInput from "./web-components/input/select-input.js";
SelectInput.define();
export default SelectInput;
export * from "./web-components/input/select-input.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-select-input": SelectInput;
  }
}
