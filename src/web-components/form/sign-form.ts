import { define } from "../../root.js";
import BaseForm from "./base-form.js";

/**
 * SignForm is now an alias for {@linkcode BaseForm}.
 *
 * @extends BaseForm
 */
@define("sign-form")
export class SignForm extends BaseForm {
  /**
   * @deprecated
   */
  set: 0 | 1 | 2;
}

export default SignForm;

declare global {
  interface HTMLElementTagNameMap {
    "sign-form": SignForm;
  }
}
