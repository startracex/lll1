import { css, type CSSResultGroup, html, ifDefined, property, query } from "../deps.js";
import { cssvarValues, define, GodownElement } from "../root.js";
import { htmlSlot, type HTMLTemplate, svgDelta, svgX } from "../lib/templates.js";
import { InputSTD } from "./std.js";

@define("select-input")
export class SelectInput extends InputSTD {
  static styles = [
    InputSTD.styles,
    css`
      :host {
        background: var(${cssvarValues.input}--background);
        display: inline-flex;
        outline: var(${cssvarValues.input}--outline-width) solid transparent;
        height: var(${cssvarValues.input}--height);
        width: var(${cssvarValues.input}--width);
        border-radius: var(${cssvarValues.input}--radius);
      }

      :host([open]) {
        outline-color: var(${cssvarValues.input}--outline-color);
      }

      input {
        padding: 0 0 0 0.25em;
        background: none;
        cursor: inherit;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        border: inherit;
        outline: none;
        border-radius: inherit;
        flex: 1;
      }

      div {
        display: inline-flex;
        position: relative;
        width: 100%;
        border-radius: inherit;
        z-index: inherit;
      }

      label svg {
        height: 100%;
      }

      aside {
        margin-top: 1px;
        position: absolute;
        top: 100%;
        width: 100%;
        visibility: hidden;
        z-index: 1;
        border-radius: inherit;
      }

      section {
        max-width: calc(100% - 1.2em);
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        border-radius: inherit;
        z-index: inherit;
      }

      i.selected-item {
        background: var(${cssvarValues.input}--true);
        border-radius: inherit;
        height: 100%;
        float: left;
        display: inline-flex;
        font-style: normal;
        align-items: center;
        padding-left: 0.1em;
        margin-left: 0.065em;
      }

      i:first-child {
        margin-left: 0;
      }

      i.selected-item svg {
        width: 1em;
        padding: 0 0.12em;
        height: 0.8em;
        pointer-events: all;
      }

      aside[open] {
        visibility: visible;
      }
    `,
  ] as CSSResultGroup;
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) only = false;
  @property({ type: Array }) value = [];
  @property() name = "select";
  @property({ type: Array }) text: string[] = [];
  @property({ type: Boolean }) autofocus = false;

  get assigned() {
    return super.assigned as any;
  }

  @query("input") _input: HTMLInputElement;
  @query("aside") _aside: HTMLInputElement;

  protected render(): HTMLTemplate {
    return html` <div>
      <section>${this.renderList()}</section>
      <input
        id="input"
        @focus="${() => {
          this.open = true;
        }}"
        @input="${this._handleInput}"
        placeholder="${ifDefined(this.pla)}"
      />
      <label for="input">${svgDelta()}</label>
      <aside ?open="${this.open}">${htmlSlot()}</aside>
    </div>`;
  }

  private renderList(): HTMLTemplate[] {
    const itemTemplates = [];
    if (this.value.length) {
      for (const i in this.value) {
        itemTemplates.push(
          html`<i class="selected-item">
            ${this.text[i] || this.value[i]}
            <div
              @click="${() => {
                this.select(this.value[i]);
              }}"
            >
              ${svgX()}
            </div>
          </i>`,
        );
      }
    }
    return itemTemplates;
  }

  protected _focusCheck() {
    if (this.autofocus) {
      this._input?.focus();
      this.open = true;
    }
  }

  focus(options?: FocusOptions) {
    this._input?.focus(options);
    this.open = true;
  }

  connectedCallback() {
    GodownElement.prototype.connectedCallback.call(this);
  }

  getOptionValue(option: HTMLElement | any) {
    return option.value || option.getAttribute("value");
  }

  protected firstUpdated() {
    const defs = this.def.split(";");
    defs
      .filter((i) => i.trim())
      .forEach((i) => {
        this.select(i);
      });
    this._focusCheck();
    const click = "click";
    (this.assigned as HTMLElement[]).forEach((option: HTMLElement) => {
      if (this.getOptionValue(option)) {
        this.addEvent(option, click, () => {
          this.select(this.getOptionValue(option), option.textContent);
        });
      } else if (option.children) {
        [...option.children].forEach((option: HTMLElement) => {
          this.addEvent(option, click, () => {
            this.select(this.getOptionValue(option), option.textContent);
          });
        });
      }
    });
    this.addEvent(this, "change", () => {
      this.open = !this.only;
    });
    this.addEvent(document, click, (e) => {
      if (!this.contains(e.target as Node)) {
        this.open = false;
      }
    });
  }

  select(value: string, text?: string) {
    if (text === undefined || text === null) {
      this.assigned.some((option: HTMLElement) => {
        const optionValue = this.getOptionValue(option);
        if (optionValue) {
          if (optionValue === value) {
            text = option.textContent;
            return true;
          }
        } else if (option.children) {
          return [...option.children].some((subOption) => {
            const subOptionValue = this.getOptionValue(subOption);
            if (subOptionValue === value) {
              text = subOption.textContent;
              return true;
            }
            return false;
          });
        }
        return false;
      });
    }
    if (this.value.includes(value)) {
      if (!this.only) {
        this.value = this.value.filter((v) => v !== value);
        this.text = this.text.filter((v) => v !== text);
      } else {
        this.value = [];
        this.text = [];
      }
    } else {
      if (!this.only) {
        this.value.push(value);
        this.text.push(text);
      } else {
        this.value = [value];
        this.text = [text];
      }
    }
    this._input.value = "";
    this.dispatchEvent(new CustomEvent("change", { detail: this.namevalue() }));
    this.requestUpdate();
  }

  _handleInput() {
    let value = this._input.value.trim();
    if (!this.only && value.includes(";")) {
      value = value.split(";").pop().trim();
    }
    this.assigned.forEach((option) => {
      if (this.getOptionValue(option)) {
        option.style.display = "block";
      }
      if (option.children) {
        option.style.display = "block";
        [...option.children].forEach((subOption) => {
          subOption.style.display = "block";
        });
      }
    });
    if (value) {
      this.assigned.forEach((option) => {
        const optionValue = this.getOptionValue(option);
        if (optionValue) {
          const isMatch = includesIgnoreCase(optionValue, value) || includesIgnoreCase(option.innerText, value);
          option.style.display = isMatch ? "block" : "none";
        } else if (option.children) {
          [...option.children].forEach((subOption) => {
            const subOptionValue = this.getOptionValue(subOption);
            const isSubMatch = includesIgnoreCase(subOptionValue, value) || includesIgnoreCase(subOption.innerText, value);
            subOption.style.display = isSubMatch ? "block" : "none";
          });
          if ([...option.children].filter((option) => option.style.display === "block").length === 0) {
            option.style.display = "none";
          }
        }
      });
    }
    this.dispatchEvent(new CustomEvent("input", { detail: this.namevalue() }));
  }

  namevalue(): [string, any[]] | [string, any] {
    return [this.name, this.only ? this.value[0] : this.value];
  }

  reset() {
    this.value = [];
    this.text = [];
    this._input.value = "";
    if (this.def) {
      const defs = this.def.split(";");
      const defToSelect = this.only ? [defs[0]] : defs;
      defToSelect
        .filter((def) => def.trim())
        .forEach((def) => {
          this.select(def.trim(), null);
        });
    }
  }
}

export default SelectInput;

function includesIgnoreCase(a: string, b: string): boolean {
  return a.toLowerCase().includes(b.toLowerCase());
}

declare global {
  interface HTMLElementTagNameMap {
    "select-input": SelectInput;
  }
}
