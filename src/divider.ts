import Divider from "./web-components/divider/divider.js";
Divider.define();
export default Divider;
export * from "./web-components/divider/divider.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-divider": Divider;
  }
}
