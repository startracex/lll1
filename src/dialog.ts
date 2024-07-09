import Dialog from "./web-components/dialog/dialog.js";
Dialog.define();
export default Dialog;
export * from "./web-components/dialog/dialog.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-dialog": Dialog;
  }
}
