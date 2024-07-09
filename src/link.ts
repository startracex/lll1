import Link from "./web-components/link/link.js";
Link.define();
export default Link;
export * from "./web-components/link/link.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-link": Link;
  }
}
