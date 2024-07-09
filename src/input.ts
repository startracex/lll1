import Input from "./web-components/input/input.js";
Input.define();
export default Input;
export * from "./web-components/input/input.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-input": Input;
  }
}
