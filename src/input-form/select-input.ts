import { conf, css, CSSResultGroup, cssvar, define, DisableWarning, html, LitElement, property, query } from "../deps.js";
import STD from "./std.js";

@define("select-input")
export class SelectInput extends STD {
  static styles = [
    STD.styles,
    css`
      :host {
        background: var(${cssvar}--input-background);
        color: var(${cssvar}--text);
        display: inline-flex;
        outline: 0.145em solid transparent;
        border-radius: 0.25em;
        height: 1.5em;
        width: var(${cssvar}--input-width);
      }
      :host([open]) {
        outline-color: var(${cssvar}--input-outline-focus);
      }
      input {
        padding: 0px 0px 0px 0.25em;
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
        background: var(${cssvar}--input-true);
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
  ] as CSSResultGroup[];
  @property({ type: Boolean, reflect: true }) open = false;
  @property() selcls = `${conf.tag("select-input")}-selected`;
  @property() pla?: string = undefined;
  @property({ type: Boolean, reflect: true }) only = false;
  @property() def: string = "";
  @property({ type: Array }) value = [];
  @property({ reflect: true }) name = "select";
  @property({ type: Array }) text: Array<string> = [];
  @property({ type: Boolean }) autofocus = false;

  get assigned(): any {
    return this.shadowRoot.querySelector("slot").assignedElements();
  }
  @query("input") _input: HTMLInputElement;
  @query("aside") _aside: HTMLInputElement;
  render() {
    return html`<div>
      <section>${this.lists()}</section>
      <input
        id="input"
        @focus=${() => {
          this.open = true;
        }}
        @input=${this._handleInput}
        placeholder=${this.pla}
      />
      <label for="input">
        <svg viewBox="0 0 48 48" fill="none"><path d="M36 19L24 31L12 19H36Z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round" /></svg>
      </label>
      <aside ?open=${this.open}><slot></slot></aside>
    </div>`;
  }
  lists() {
    const itemTemplates = [];
    if (this.value.length)
      for (const i in this.value) {
        itemTemplates.push(
          html`<i class="selected-item">
            ${this.text[i] || this.value[i]}
            <svg
              @click=${() => {
                this.select(this.value[i]);
              }}
              viewBox="0 0 1024 1024"
              version="1.1"
            >
              <path d="M960 512c0-249.6-198.4-448-448-448S64 262.4 64 512s198.4 448 448 448 448-198.4 448-448zM691.2 736L512 556.8 332.8 736c-12.8 12.8-32 12.8-44.8 0-12.8-12.8-12.8-32 0-44.8L467.2 512 288 332.8c-12.8-12.8-12.8-32 0-44.8 12.8-12.8 32-12.8 44.8 0L512 467.2 691.2 288c12.8-12.8 32-12.8 44.8 0 12.8 12.8 12.8 32 0 44.8L556.8 512 736 691.2c12.8 12.8 12.8 32 0 44.8-12.8 12.8-32 12.8-44.8 0z" fill="currentColor"></path>
            </svg>
          </i>`,
        );
      }
    return itemTemplates;
  }
  _focusCheck() {
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
    LitElement.prototype.connectedCallback.call(this);
  }
  getIndexFunc(option: HTMLOptionElement | any) {
    return this.getIndexFunc(option);
  }
  firstUpdated() {
    if (this.def) {
      if (this.only) {
        this.select(this.def);
      } else {
        for (const i of this.def.split(";")) {
          if (i.trim()) {
            this.select(i);
          }
        }
      }
    }
    this._focusCheck();
    this.assigned.forEach((option: HTMLOptionElement) => {
      if (this.getIndexFunc(option)) {
        option.addEventListener("click", () => {
          this.select(this.getIndexFunc(option), option.innerText);
        });
      } else if (option.children) {
        [...option.children].forEach((option: HTMLOptionElement) => {
          option.addEventListener("click", () => {
            this.select(this.getIndexFunc(option), option.innerText);
          });
        });
      }
    });
    this.addEventListener("change", () => {
      this.open = !this.only;
    });
    document.addEventListener("click", (e) => {
      if (!this.contains(e.target as Node)) {
        this.open = false;
      }
    });
  }
  disconnectedCallback(): void {
    this.assigned.forEach((option: HTMLOptionElement) => {
      if (this.getIndexFunc(option)) {
        option.removeEventListener("click", () => {});
      } else if (option.children) {
        [...option.children].forEach((option: HTMLOptionElement) => {
          option.removeEventListener("click", () => {
            this.select(this.getIndexFunc(option), option.innerText);
          });
        });
      }
    });
  }
  select(value: string, text?: string) {
    if (text === undefined || text === null) {
      this.assigned.forEach((option: { value: any; innerText: any; children: any }) => {
        if (this.getIndexFunc(option)) {
          if (this.getIndexFunc(option) == value) {
            text = option.innerText;
          }
        } else if (option.children) {
          [...option.children].forEach((option) => {
            if (this.getIndexFunc(option) == value) {
              text = option.innerText;
            }
          });
        }
      });
    }
    if (this.value.includes(value)) {
      if (!this.only) {
        this.value = this.value.filter((v) => v != value);
        this.text = this.text.filter((v) => v != text);
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
    this.assigned.forEach((option: { value: any; classList: { add: (arg0: string) => void; remove: (arg0: string) => void }; children: any }) => {
      if (this.getIndexFunc(option)) {
        if (this.value.includes(this.getIndexFunc(option))) {
          option.classList.add(this.selcls);
        } else {
          option.classList.remove(this.selcls);
        }
      } else if (option.children) {
        [...option.children].forEach((option) => {
          if (this.value.includes(this.getIndexFunc(option))) {
            option.classList.add(this.selcls);
          } else {
            option.classList.remove(this.selcls);
          }
        });
      }
    });
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
      if (this.getIndexFunc(option)) {
        option.style.display = "block";
      }
      if (option.children) {
        option.style.display = "block";
        [...option.children].forEach((option) => {
          option.style.display = "block";
        });
      }
    });
    if (value) {
      this.assigned.forEach((option) => {
        if (this.getIndexFunc(option)) {
          if (this.getIndexFunc(option).toLowerCase().includes(value.toLowerCase()) || option.innerText.toLowerCase().includes(value.toLowerCase())) {
            option.style.display = "block";
          } else {
            option.style.display = "none";
          }
        } else if (option.children) {
          [...option.children].forEach((option) => {
            if (this.getIndexFunc(option).toLowerCase().includes(value.toLowerCase()) || option.innerText.toLowerCase().includes(value.toLowerCase())) {
              option.style.display = "block";
            } else {
              option.style.display = "none";
            }
          });
          if ([...option.children].filter((option) => option.style.display == "block").length == 0) {
            (option as HTMLElement).style.display = "none";
          }
        }
      });
    }
    this.dispatchEvent(new CustomEvent("input", { detail: this.namevalue() }));
  }
  namevalue(): [string, any[]] | [string, any] {
    if (!this.only) {
      return [this.name, this.value];
    }
    return [this.name, this.value[0]];
  }
  reset() {
    this.value = [];
    this.text = [];
    this._input.value = "";
    this.assigned.forEach((option: { value: any; classList: { remove: (arg0: string) => void }; children: any }) => {
      if (this.getIndexFunc(option)) {
        option.classList.remove(this.selcls);
      } else if (option.children) {
        [...option.children].forEach((option) => {
          option.classList.remove(this.selcls);
        });
      }
    });
    if (this.def) {
      if (!this.only) {
        this.def.split(";").forEach((def) => {
          if (def.trim()) this.select(def.trim(), null);
        });
      } else {
        if (this.def.split(";")[0].trim()) this.select(this.def.split(";")[0].trim(), null);
      }
    }
  }
}
DisableWarning(SelectInput);

export default SelectInput;
declare global {
  interface HTMLElementTagNameMap {
    "select-input": SelectInput;
  }
}
