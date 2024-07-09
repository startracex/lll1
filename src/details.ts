import Details from "./web-components/details/details.js";
Details.define();
export default Details;
export * from "./web-components/details/details.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-details": Details;
  }
}
