import RouterLink from "./web-components/link/router-link.js";
RouterLink.define();
export default RouterLink;
export * from "./web-components/link/router-link.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-router-link": RouterLink;
  }
}
