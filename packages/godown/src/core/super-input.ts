import { part } from "@godown/element/decorators/part.js";
import { styles } from "@godown/element/decorators/styles.js";
import { htmlSlot } from "@godown/element/directives/index.js";
import { type HandlerEvent } from "@godown/element/element.js";
import iconEyeSlashFill from "@godown/f7-icon/icons/eye-slash-fill.js";
import { css, html } from "lit";
import { property } from "lit/decorators.js";

import { cssGlobalVars, GlobalStyle } from "./global-style.js";

const fieldStyle = css`
  .input-field {
    display: flex;
    position: relative;
    align-items: center;
    border-radius: inherit;
    height: inherit;
  }

  .input-field input {
    background: transparent;
  }

  .input-field:focus-within,
  .input-field.outline {
    box-shadow: var(${cssGlobalVars.input}-box-shadow);
  }

  .input-field i {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .input-field label {
    height: 100%;
    display: flex;
  }

  .input-field [part="space"]{
    width: var(${cssGlobalVars.input}-space);
  }

  input::-ms-reveal,
  input::-ms-clear {
    display: none;
  }
`;

const inputStyle = css`
:host {
  ${cssGlobalVars.input}-width: 10em;
  ${cssGlobalVars.input}-height: 1.6em;
  ${cssGlobalVars.input}-space: 0.2em;
  ${cssGlobalVars.input}-background: var(${cssGlobalVars.background});
  ${cssGlobalVars.input}-control: var(${cssGlobalVars.foreground});
  ${cssGlobalVars.input}-control-edge: var(${cssGlobalVars.active});
  ${cssGlobalVars.input}-radius: 0.2em;
  ${cssGlobalVars.input}-box-shadow: 0px 0px 0px .1em var(${cssGlobalVars.active});
  border-radius: var(${cssGlobalVars.input}-radius);
}

:host([disabled]) {
  cursor: not-allowed;
  filter: brightness(0.85);
}

input:disabled {
  cursor: inherit;
}
`;

@styles(fieldStyle, inputStyle)
class SuperInput extends GlobalStyle {
  autofocus: boolean;
  @property()
  autocomplete: string | boolean;

  @property({ type: Boolean, reflect: true })
  disabled: boolean;

  @property({ reflect: true })
  type: InputType;

  @property({ reflect: true })
  placeholder: string;

  @property({ reflect: true })
  label: string;

  @property({ reflect: true })
  name: string;

  @property()
  value: any;

  /**
   * default property records the default or initial value and is used to reset the input.
   */
  @property()
  default: any;

  @part("input")
  _input: HTMLInputElement;

  /**
   * Returns true when the input is compositing.
   */
  compositing: boolean;

  set defaultValue(value: typeof this.default) {
    this.default = value;
  }

  get defaultValue() {
    return this.default;
  }

  makeId = Math.random().toString(36).slice(1);

  namevalue(): [string, any] {
    return [this.name, this.value];
  }

  nameValue = this.namevalue;

  reset() {
    this.value = this.default;
    this._input.value = this.default;
  }

  protected _handleInput(e: HandlerEvent<HTMLInputElement>) {
    e.stopPropagation();
    if (this.compositing) {
      return;
    }
    this.value = e.target.value?.trim();
    this.dispatchEvent(
      new CustomEvent("input", {
        detail: this.value,
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(new CustomEvent("change", { detail: this.value, composed: true }));
  }

  connectedCallback() {
    super.connectedCallback();
    this._connectedInit();
  }

  protected _connectedInit() {
    this.default ??= this.value || "";
    this.value ??= this.default;
  }

  protected _compositionInit() {
    if (this._input) {
      this.events.add(this._input, "compositionstart", () => this.compositing = true);
      this.events.add(this._input, "compositionend", (e: HandlerEvent<HTMLInputElement>) => {
        this.compositing = false;
        this._handleInput(e);
      });
    }
  }

  protected _changeInputType(t: typeof this.type) {
    if (this._input) {
      this._input.type = t;
    }
  }

  focus(options?: FocusOptions) {
    this._input?.focus(options);
  }

  protected firstUpdated() {
    this._compositionInit();
  }

  protected _renderPrefix() {
    return html`<label for=${this.makeId} part="prefix">
    <i part="space"></i>
    ${htmlSlot("prefix")}</label>`;
  }

  protected _renderSuffix() {
    const PASSWORD = "password";
    return html`<label for=${this.makeId} part="suffix">${
      this.type === "password"
        ? html`<i
            part="icon"
            @mousedown="${() => this._changeInputType("text")}"
            @mouseup="${() => this._changeInputType(PASSWORD)}"
            @mouseleave="${() => this._changeInputType(PASSWORD)}"
          >
          <i part="space"></i>
          ${iconEyeSlashFill()}</i>`
        : htmlSlot("suffix")
    }
    <i part="space"></i>
  </label>`;
  }
}

export default SuperInput;

type InputType =
  | "hidden"
  | "text"
  | "search"
  | "tel"
  | "url"
  | "email"
  | "password"
  | "datetime"
  | "date"
  | "month"
  | "week"
  | "time"
  | "datetime-local"
  | "number"
  | "range"
  | "color"
  | "checkbox"
  | "radio"
  | "file"
  | "image";
