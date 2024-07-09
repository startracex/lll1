import Form from "./web-components/form/form.js";
Form.define();
export default Form;
export * from "./web-components/form/form.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-form": Form;
  }
}
