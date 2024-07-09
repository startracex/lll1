import Router from "./web-components/router/router.js";
Router.define();
export default Router;
export * from "./web-components/router/router.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-router": Router;
  }
}
