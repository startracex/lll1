import Overbreath from "./web-components/text/overbreath.js";
Overbreath.define();
export default Overbreath;
export * from "./web-components/text/overbreath.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-overbreath": Overbreath;
  }
}
