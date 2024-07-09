import { html, property } from "../_deps.js";
import { part } from "../decorators/part.js";
import { svgEye } from "../lib/icons.js";
import type { HTMLEvent } from "./godown-element.js";
import { GodownElement } from "./godown-element.js";

const PASSWORD = "password";

export class GodownSuperInput extends GodownElement {
  @property({ type: Boolean, reflect: true }) autofocus: boolean;
  @property({ reflect: true }) type: InputType;
  @property({ reflect: true }) placeholder: string;
  @property({ reflect: true }) label: string;
  @property({ reflect: true }) name: string;
  @property() autocomplete: string;
  @property() value: any;
  @property() default: any;

  @part("input") _input: HTMLInputElement;

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

  protected _handleInput(e: HTMLEvent<HTMLInputElement>) {
    e.stopPropagation();
    if (this.compositing) {
      return;
    }
    this.value = e.target.value?.trim();
    this.dispatchEvent(new CustomEvent("input", { detail: this.value, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent("change", { detail: this.value, composed: true }));
  }

  connectedCallback() {
    super.connectedCallback();
    this._connectedInit();
  }
  _connectedInit() {
    this.default ??= this.value || "";
    this.value ??= this.default;
  }

  protected _compositionInit() {
    if (this._input) {
      this.addEvent(this._input, "compositionstart", () => {
        this.compositing = true;
      });
      this.addEvent(this._input, "compositionend", (e: HTMLEvent<HTMLInputElement>) => {
        this.compositing = false;
        this._handleInput(e);
      });
    }
  }

  protected _changeInputType(t: InputType) {
    this._input.type = t;
  }

  focus(options?: FocusOptions) {
    this._input?.focus(options);
  }

  protected firstUpdated() {
    this._compositionInit();
  }

  protected targetValue(e: Event): string | any {
    const target = e.target as HTMLInputElement;
    if (typeof target.value === "string") {
      return target.value.trim();
    }
    return target.value;
  }

  protected _renderSuffix() {
    if (this.type === PASSWORD) {
      return html`
        <label for=${this.makeId} part="label">
          <i
            part="icon"
            @mousedown="${() => this._changeInputType("text")}"
            @mouseup="${() => {
              this._changeInputType(PASSWORD);
            }}"
            @mouseleave="${() => {
              this._changeInputType(PASSWORD);
            }}"
          >
            ${svgEye()}
          </i>
        </label>
      `;
    }
  }

  /**
   * @deprecated
   */
  pla: string;
  /**
   * @deprecated
   */
  def: string;
  /**
   * @deprecated
   */
  compositionCheck: boolean;
}

export default GodownSuperInput;
export type InputType =
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
