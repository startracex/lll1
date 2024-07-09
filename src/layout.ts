import Layout from "./web-components/layout/layout.js";
Layout.define();
export default Layout;
export * from "./web-components/layout/layout.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-layout": Layout;
  }
}
