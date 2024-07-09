import Text from "./web-components/text/text.js";
Text.define();
export default Text;
export * from "./web-components/text/text.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-text": Text;
  }
}
