import Typewriter from "./web-components/text/typewriter.js";
Typewriter.define();
export default Typewriter;
export * from "./web-components/text/typewriter.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-typewriter": Typewriter;
  }
}
