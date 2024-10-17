import { godown } from "@godown/element/decorators/godown.js";
import { styles } from "@godown/element/decorators/styles.js";
import { htmlSlot } from "@godown/element/directives/html-slot.js";
import { css } from "lit";
import { property } from "lit/decorators.js";

import { GlobalStyle } from "../core/global-style.js";

const protoName = "form";

/**
 * {@linkcode Form} Gets child element key-value object,
 * which will be nested if the child element is the same as this element.
 *
 * @slot - Child elements.
 *
 * @category form
 */
@godown(protoName)
@styles(
  css`
    :host {
      display: block;
    }
  `,
)
class Form<T = object> extends GlobalStyle {
  @property()
  name = "";
  get value(): T {
    return Form.buildValue(this._slot.assignedElements()) as T;
  }

  nameValue = this.namevalue;

  protected render() {
    return htmlSlot();
  }

  reset() {
    this.deepQuerySelectorAll<HTMLElement & { reset?: () => void; }>("*").forEach((el) => {
      if (el.tagName === this.tagName) {
        return;
      }
      if (el.reset) {
        el.reset();
      }
    });
  }

  namevalue(): [string, T] {
    return [this.name, this.value];
  }

  static buildValue(
    elements: (Element & {
      name?: string;
      value?: unknown;
      namevalue?: () => [string, unknown];
    })[],
  ): Record<string, any> {
    const result = {};
    for (const el of elements) {
      if (el.tagName === "FORM") {
        Object.assign(result, Object.fromEntries(new FormData(el as HTMLFormElement).entries()));
      } else if (el.namevalue) {
        const [name, value] = el.namevalue();
        if (name) {
          result[name] = value;
        }
      } else if (el.name && el.value !== undefined) {
        result[el.name] = el.value;
      } else if (el.shadowRoot) {
        for (const slot of el.shadowRoot.querySelectorAll("slot")) {
          Object.assign(result, this.buildValue(slot.assignedElements()));
        }
      }
    }
    return result;
  }
}

export default Form;
