import Alert from "./web-components/alert/alert.js";
Alert.define();
export default Alert;
export * from "./web-components/alert/alert.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-alert": Alert;
  }
}
