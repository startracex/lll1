import SwitchInput from "./web-components/input/switch-input.js";
SwitchInput.define();
export default SwitchInput;
export * from "./web-components/input/switch-input.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-switch-input": SwitchInput;
  }
}
