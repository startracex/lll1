import Button from "./web-components/button/button.js";
Button.define();
export default Button;
export * from "./web-components/button/button.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-button": Button;
  }
}
