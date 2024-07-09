import Rotate from "./web-components/wrapper/rotate.js";
Rotate.define();
export default Rotate;
export * from "./web-components/wrapper/rotate.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-rotate": Rotate;
  }
}
