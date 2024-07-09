import Dragbox from "./web-components/wrapper/dragbox.js";
Dragbox.define();
export default Dragbox;
export * from "./web-components/wrapper/dragbox.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-dragbox": Dragbox;
  }
}
