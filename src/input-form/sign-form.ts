import { css, CSSResultGroup, define, html, property, query, queryAll } from "../deps.js";
import { FormSTD } from "./std.js";
import { htmlSlot } from "../tmpl.js";

@define("base-form")
export class BaseForm extends FormSTD {
  @property() enctype = "multipart/form-data";
  static styles = [
    css`
      :host {
        display: flow-root;
      }

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
  ] as CSSResultGroup[];
  @query("form") _form: HTMLFormElement;
  @queryAll("slot") _slots: HTMLSlotElement[];

  render() {
    return html`<form enctype="multipart/form-data">
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
    const x = {};
    const form = document.createElement("form");
    form.enctype = enctype;
    for (const slot of this.shadowRoot.querySelectorAll("slot")) {
      for (const i of slot.assignedNodes() as any) {
        if (i.namevalue) {
          const [name, value] = i.namevalue();
          if (name) {
            x[name] = value;
          }
        } else {
          form.appendChild(i.cloneNode(true));
        }
      }
    }
    const y = new FormData(form);
    for (const [key, value] of y) {
      x[key] = value;
    }
    each(this._form, (node: any) => {
      if (node.namevalue) {
        const [name, value] = node.namevalue();
        if (name) {
          x[name] = value;
        }
      }
    });
    form.remove();
    return [this.name, x];
  }

  FormData(): FormData {
    const x = {};
    const form = document.createElement("form");
    form.enctype = "multipart/form-data";
    for (const slot of this._slots) {
      for (const i of slot.assignedNodes() as any) {
        if (i.FormData) {
          for (const [key, value] of i.FormData()) {
            x[key] = value;
          }
        } else {
          form.appendChild(i.cloneNode(true));
        }
      }
    }
    const y = new FormData(form);
    each(this._form, (node: any) => {
      if (node.namevalue) {
        const [name, value] = node.namevalue();
        if (name) {
          y.append(name, value);
        }
      }
    });
    for (const key in x) {
      y.append(key, x[key]);
    }
    form.remove();
    return y;
  }
}

function each(node: Node, callback: (node: Node) => void) {
  if (node) {
    callback(node);
    for (const i of node.childNodes) {
      each(i, callback);
    }
  }
}

@define("sign-form")
export class SignForm extends BaseForm {}

export default SignForm;
declare global {
  interface HTMLElementTagNameMap {
    "sign-form": SignForm;
    "base-form": BaseForm;
  }
}
