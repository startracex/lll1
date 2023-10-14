import { html, css, property, query, ifDefined, define, cssvar } from "../deps.js";
import STD from "./std.js";
import type { InputType } from "./std.js";
@define("base-input")
export class BaseInput extends STD {
  @query("input") _input: HTMLInputElement;
  @query(".range i") _ranged: HTMLElement;
  @property() accept = undefined;
  @property() label = "";
  @property() name = "";
  @property() pla = undefined;
  @property() type: InputType = "text";
  @property() value: string | File | FileList = undefined;
  @property() def: string = "";
  @property({ type: Boolean }) only = false;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property({ type: Boolean }) autofocus = false;
  static styles = [
    STD.styles,
    css`
      :host {
        width: var(${cssvar}--input-width);
        height: 1em;
        display: inline-flex;
        background-color: var(${cssvar}--input-background);
        border-radius: 0.2em;
        outline: 0.18em solid transparent;
        color: var(${cssvar}--text);
      }
      :host(:focus-within) {
        outline-color: var(${cssvar}--input-outline-focus);
      }
      :host([type="range"]) {
        outline: none;
        height: auto;
      }
      :host([type="file"]) {
        height: auto;
        width: auto;
        min-height: 0.5em;
        min-width: 0.5em;
      }
      div,
      label {
        display: flex;
        flex: 1;
      }
      * {
        border-radius: inherit;
        cursor: inherit;
        font-family: inherit;
      }
      .input[type="color"] {
        padding: 0;
        height: 100% !important;
      }
      .input[type="file"] {
        display: none;
      }
      .input {
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        font-size: 0.8em;
        outline: 0;
        border: 0;
        margin: 0;
        border: none;
        color: inherit;
        background: transparent;
        padding: 0 0.25em;
        border-radius: 0.25em;
      }
      .range {
        position: relative;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 0.5px 0.1em var(${cssvar}--shadow);
        background-color: var(${cssvar}--input-false);
      }
      .range input ~ i {
        position: absolute;
        left: 0;
        width: 50%;
        pointer-events: none;
        background-color: var(${cssvar}--input-true);
        height: calc(0.6em - 1.1px);
      }
      .range input {
        height: 0.6em;
        margin: 0px -0.5em;
        width: calc(100% + 0.5em);
        appearance: none;
        -webkit-appearance: none;
        outline: none;
        background-color: transparent;
      }
      .range input::-webkit-slider-runnable-track {
        height: 0.6em;
      }
      .range input::-webkit-slider-thumb {
        z-index: 1;
        appearance: none;
        -webkit-appearance: none;
        position: relative;
        height: 1.2em;
        width: 1.2em;
        margin-top: -0.3em;
        background-color: var(${cssvar}--input-control);
        border-radius: 50%;
        border: solid 0.125em rgba(0, 221, 255, 0.5);
        box-shadow: 0 0.1em 0.1em var(${cssvar}--shadow);
      }
    `,
  ];
  render() {
    if (!this.name) this.name = this.label?.toLowerCase() || this.type;
    return html`<label for="input">
      <slot name="pre"></slot>
      <slot></slot>
      <div class=${this.type}>${this._typeSwitcher()}</div>
      <slot name="suf"></slot>
    </label>`;
  }
  connectedCallback(): void {
    super.connectedCallback();
    if (!this.def && this.type !== "file") this.def = (this.value as string) || "";
    if (!this.value) this.value = this.def;
  }
  firstUpdated() {
    if (this.type === "range") {
      this._ranged.style.width = 100 * (parseInt(this.value as string) / (this.max - this.min)) + "%";
      if (this.childNodes.length) {
        this.shadowRoot.querySelector("div").style.margin = "0";
      }
    }
    this._focusCheck();
    this._compositionCheck();
  }
  _handleRange(e) {
    this.value = e.target.value;
    this._ranged.style.width = (100 * parseInt(e.target.value)) / (this.max - this.min) + "%";
    this.dispatchEvent(new CustomEvent("input", { detail: this.value }));
  }
  _handleFile(e) {
    this.value = !this.only ? e.target.files : e.target.files[0];
    this.dispatchEvent(new CustomEvent("change", { detail: this.value }));
  }
  reset() {
    if (this.type === "range") {
      this._input.value = this.def || ((this.max - this.min) / 2).toString();
      this.value = this._input.value;
      this._ranged.style.width = 100 * (parseInt(this.value) / (this.max - this.min)) + "%";
    } else {
      this._input.value = this.def.toString();
      this.value = this.def;
    }
  }
  _typeSwitcher() {
    switch (this.type) {
      case "range":
        return html`<input id="input" type="range" min=${this.min} max=${this.max} step=${this.step} value=${this.value} @input=${this._handleRange} @change=${this._handleChange} /><i></i>`;
      case "file":
        return html`<input id="input" type="file" accept=${ifDefined(this.accept)} ?multiple=${!this.only} class="input" @change=${this._handleFile} />`;
      default:
        return html`<input id="input" class="input" type=${this.type} placeholder=${this.pla} value=${this.value} @input=${this._handleInput} @change=${this._handleChange} />`;
    }
  }
}
export default BaseInput;
declare global {
  interface HTMLElementTagNameMap {
    "base-input": BaseInput;
  }
}
