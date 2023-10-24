import { css, CSSResultGroup, cssvar, GlobalSTD, property } from "../deps.js";

export type InputType = "hidden" | "text" | "search" | "tel" | "url" | "email" | "password" | "datetime" | "date" | "month" | "week" | "time" | "datetime-local" | "number" | "range" | "color" | "checkbox" | "radio" | "file" | "image";

export default class InputFormSTD extends GlobalSTD {
  static styles = [
    GlobalSTD.styles,
    css`
      :host {
        ${cssvar}--text: rgb(240 240 240);
        ${cssvar}--input-outline: rgb(25 130 180);
        ${cssvar}--input-outline-focus: rgb(29 155 180);
        ${cssvar}--input-outline-width: .15em;
        ${cssvar}--input-background: rgb(24 24 24);
        ${cssvar}--input-background-hover: rgb(42 42 42);
        ${cssvar}--input-true: rgb(47 129 237);
        ${cssvar}--input-false: rgb(204 204 204);
        ${cssvar}--input-width: 10.6rem;
        ${cssvar}--input-height: 1.6em;
      }

      ::-webkit-calendar-picker-indicator {
        background-color: var(${cssvar}--input-true);
        border-radius: 0.1rem;
      }

      :host(:focus),
      :host(:focus-within) {
        outline-color: var(${cssvar}--input-outline);
      }
    `,
  ] as CSSResultGroup[];
  @property() name: string = undefined;
  @property() value: string | any = undefined;
  def: string;
  _input: HTMLInputElement;
  compositing: boolean;
  autofocus: boolean;
  label?: string;
  type?: string;

  namevalue(): [string, any] {
    return [this.name, this.value];
  }

  nameValue = (): ReturnType<InputFormSTD["namevalue"]> => this.namevalue();

  reset() {
    this.value = this.def;
    this._input.value = this.def;
  }

  protected _handleInput(e: any) {
    e.stopPropagation();
    this.value = e.target.value?.trim();
    if (this.compositing) return;
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

  protected _focusCheck() {
    if (this.autofocus) {
      this.focus();
    }
  }

  focus(options?: FocusOptions) {
    this._input?.focus(options);
  }

  firstUpdated() {
    this._focusCheck();
    this._compositionCheck();
  }

  protected targetValue(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.value.trim) {
      return target.value.trim();
    }
    return target.value;
  }
}
