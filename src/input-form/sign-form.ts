import { css, type CSSResultGroup, html, property, query } from "../deps.js";
import { htmlSlot, type HTMLTemplate } from "../lib/templates.js";
import { define } from "../root.js";
import { each } from "../lib/utils.js";
import { FormSTD } from "./std.js";

@define("base-form")
export class BaseForm extends FormSTD {
  /**
   * Form enctype.
   */
  @property() enctype: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain" = "multipart/form-data";

  @query("form") _form: HTMLFormElement;

  static styles = [
    css`
      form {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0;
      }

      main {
        display: flex;
        flex-direction: column;
      }
    `,
  ] as CSSResultGroup;

  protected render(): HTMLTemplate {
    return html`<form enctype="${this.enctype}">
      ${htmlSlot("pre")}
      <main>${htmlSlot()}</main>
      ${htmlSlot("suf")}
    </form>`;
  }

  reset() {
    each(this._form, (node: HTMLFormElement | BaseForm) => {
      if (node.reset) {
        node.reset();
      }
    });
    const form: any = document.createElement("form");
    for (const slot of this.shadowRoot.querySelectorAll("slot")) {
      for (const i of slot.assignedNodes() as any) {
        if (i.reset) {
          i.reset();
        }
        form.appendChild(i.cloneNode(true));
      }
    }
    form.reset();
    for (const slot of this.shadowRoot.querySelectorAll("slot")) {
      for (const i of slot.assignedNodes() as any) {
        if (i.name && form[i.name]) {
          i.value = form[i.name].value;
        }
      }
    }
    form.remove();
  }

  namevalue(enctype = this.enctype): [string, Record<string, any>] {
    const result = {};
    const tempForm = document.createElement("form");
    tempForm.enctype = enctype;
    for (const slot of this.shadowRoot.querySelectorAll("slot")) {
      for (const i of slot.assignedNodes() as any) {
        if (i.namevalue) {
          const [name, value] = i.namevalue();
          if (name) {
            result[name] = value;
          }
        } else {
          tempForm.appendChild(i.cloneNode(true));
        }
      }
    }
    const formData = new FormData(tempForm);
    for (const [key, value] of formData) {
      result[key] = value;
    }
    each(this._form, (node: any) => {
      if (node.namevalue) {
        const [name, value] = node.namevalue();
        if (name) {
          result[name] = value;
        }
      }
    });
    tempForm.remove();
    return [this.name, result];
  }

  FormData(): FormData {
    const temp = {};
    const tempForm = document.createElement("form");
    tempForm.enctype = this.enctype;
    for (const slot of this._slots) {
      for (const i of slot.assignedNodes() as any) {
        if (i.FormData) {
          for (const [key, value] of i.FormData()) {
            temp[key] = value;
          }
        } else {
          tempForm.appendChild(i.cloneNode(true));
        }
      }
    }
    const formData = new FormData(tempForm);
    each(this._form, (node: any) => {
      if (node.namevalue) {
        const [name, value] = node.namevalue();
        if (name) {
          formData.append(name, value);
        }
      }
    });
    for (const key in temp) {
      formData.append(key, temp[key]);
    }
    tempForm.remove();
    return formData;
  }
}

/**
 * SignForm is now an alias for {@linkcode BaseForm}.
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
    "base-form": BaseForm;
  }
}
