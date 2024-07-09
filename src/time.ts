import Time from "./web-components/text/time.js";
Time.define();
export default Time;
export * from "./web-components/text/time.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-time": Time;
  }
}
