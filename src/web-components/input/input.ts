import { css, type CSSResultGroup, property } from "../../deps.js";
import { cssvarValues, GodownElement } from "../../root.js";

export type InputType = "hidden" | "text" | "search" | "tel" | "url" | "email" | "password" | "datetime" | "date" | "month" | "week" | "time" | "datetime-local" | "number" | "range" | "color" | "checkbox" | "radio" | "file" | "image";

export class InputElement extends GodownElement {
  @property({ reflect: true }) type: InputType = "text";
  @property() name: string = undefined;
  @property() value: string | any = undefined;
  @property({ reflect: true }) label = "";
  @property() def = "";
  @property({ reflect: true }) pla?: string = undefined;
  @property({ type: Boolean, reflect: true }) autofocus = false;

  _input: HTMLInputElement;
  compositing: boolean;

  static styles = [
    GodownElement.styles,
    css`
      :host {
        display: flex;
      }
      ::-ms-reveal {
        display: none;
      }
      ::-webkit-calendar-picker-indicator {
        background-color: var(${cssvarValues.input}-true);
        border-radius: 0.1rem;
      }
    `,
  ] as CSSResultGroup;

  namevalue(): [string, any] {
    return [this.name, this.value];
  }

  nameValue = () => this.namevalue();

  reset() {
    this.value = this.def;
    this._input.value = this.def;
  }

  protected _handleInput(e: any) {
    e.stopPropagation();
    this.value = e.target.value?.trim();
    if (this.compositing) {
      return;
    }
    this.dispatchEvent(new CustomEvent("input", { detail: this.value, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent("change", { detail: this.value, composed: true }));
  }

  protected _handleChange() {
    this.dispatchEvent(new CustomEvent("change", { detail: this.value, composed: true }));
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.def) {
      this.def = this.value || "";
    }
    if (!this.value) {
      this.value = this.def;
    }
    this._initName();
  }

  protected _initName() {
    if (!this.name) {
      if (this.label || this.type) {
        this.name = this.label || this.type;
      }
    }
  }

  protected _compositionCheck() {
    if (this._input) {
      this.addEvent(this._input, "compositionstart", () => {
        this.compositing = true;
      });
      this.addEvent(this._input, "compositionend", (e: MouseEvent) => {
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
    this._compositionCheck();
    this.reset();
  }

  protected targetValue(e: Event): string | any {
    const target = e.target as HTMLInputElement;
    if (target.value.trim) {
      return target.value.trim();
    }
    return target.value;
  }
}
