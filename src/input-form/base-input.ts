import { css, CSSResultGroup, cssvar, define, GodownElement, html, ifDefined, property, query } from "../deps.js";
import { htmlSlot, type HTMLTemplate } from "../tmpl.js";
import { InputSTD } from "./std.js";
import type { InputType } from "./std.js";

@define("base-input")
export class BaseInput extends InputSTD {
  static styles = [
    InputSTD.styles,
    css`
      :host {
        ${cssvar}--input-control: rgb(240 240 240);
        ${cssvar}--input-control-edge: var(${cssvar}--input-true);
        display: inline-flex;
        width: var(${cssvar}--input-width);
        height: var(${cssvar}--input-height);
        background: var(${cssvar}--input-background);
        outline: transparent solid var(${cssvar}--input-outline-width);
        color: var(${cssvar}--text);
        border-radius: 0.2em;
      }

      input[type="file"] {
        display: none;
      }

      label,
      div {
        width: 100%;
        display: flex;
        align-items: center;
      }

      * {
        border-radius: inherit;
        cursor: inherit;
      }

      input {
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        margin: 0;
        color: inherit;
        background: transparent;
        padding: 0 0.25em;
        border-radius: 0.25em;
      }
    `,
    css`
      :host([type="range"]) {
        height: auto !important;
        margin: 0.3em 0;
        background: var(${cssvar}--input-false);
        border-radius: 2em;
      }

      .range b:nth-of-type(1) {
        width: 1em;
        left: 0;
        background: var(${cssvar}--input-true);
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      .range b {
        pointer-events: none;
        width: calc(100% - 1em);
        height: 100%;
        left: 1em;
        position: absolute;
      }

      .range {
        height: fit-content;
        position: relative;
        display: inline-flex;
        justify-content: center;
        align-items: center;
      }

      .range input {
        padding: 0;
        height: 0.6em;
        margin: 0px -0.5em;
        appearance: none;
        -webkit-appearance: none;
        outline: none;
        background: transparent;
      }

      .range i {
        position: absolute;
        left: 0;
        width: 50%;
        height: 100%;
        pointer-events: none;
        background: var(${cssvar}--input-true);
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
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
        background: var(${cssvar}--input-control);
        border-radius: 50%;
        border: solid 0.125em var(${cssvar}--input-control-edge);
        box-shadow: 0 0.1em 0.1em var(${cssvar}--shadow);
      }
    `,
  ] as CSSResultGroup[];
  @query("#input") _input: HTMLInputElement;
  @query(".range i") _ranged: HTMLElement;
  @property() accept = undefined;
  @property({ reflect: true }) type: InputType = "text";
  @property() value: string | File | FileList = undefined;
  @property({ type: Boolean }) only = false;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property({ type: Boolean }) autofocus = false;

  protected render(): HTMLTemplate {
    if (this.type === "range") {
      return html`<div class="range">
        <input id="input" type="range" min="${this.min}" max="${this.max}" step="${this.step}" @input="${this._handleRange}" @change="${this._handleRange}" />
        <b></b>
        <b>
          <i></i>
        </b>
      </div> `;
    }
    return html`<label for="input"> ${htmlSlot("pre")} ${this._typeSwitcher()} ${htmlSlot("suf")} </label>`;
  }

  connectedCallback() {
    GodownElement.prototype.connectedCallback.apply(this);
    if (this.type === "file") {
      this.value = null;
    } else {
      if (!this.def) {
        this.def = (this.value as string) || "";
      }
      if (!this.value) {
        this.value = this.def;
      }
    }
    this._initName();
  }

  protected firstUpdated() {
    if (this.type === "range") {
      this._ranged.style.width = 100 * (parseInt(this.value as string) / (this.max - this.min)) + "%";
    }
  }

  protected _handleRange(e: any | Event) {
    this.value = e.target.value;
    this._ranged.style.width = (100 * parseInt(e.target.value)) / (this.max - this.min) + "%";
    this.dispatchEvent(new CustomEvent("input", { detail: this.value }));
  }

  protected _handleFile(e: any | Event) {
    this.value = !this.only ? e.target.files : e.target.files[0];
    this.dispatchEvent(new CustomEvent("change", { detail: this.value }));
  }

  reset() {
    if (this.type === "file") {
      this.value = null;
      return;
    }
    if (this.type === "range") {
      this._input.value = this.def || ((this.max - this.min) / 2).toString();
      this.value = this._input.value;
      this._ranged.style.width = 100 * (parseInt(this.value) / (this.max - this.min)) + "%";
    } else {
      this._input.value = this.def.toString();
      this.value = this.def;
    }
  }

  protected _typeSwitcher(): HTMLTemplate {
    switch (this.type) {
      case "file":
        return html`<input id="input" class="input" type="file" accept="${ifDefined(this.accept)}" ?multiple="${!this.only}" @change="${this._handleFile}" />${htmlSlot()}`;

      case "number":
        return html`<input id="input" class="input" type="number" placeholder="${ifDefined(this.pla)}" min="${this.min}" max="${this.max}" @input="${this._handleInput}" @change="${this._handleChange}" />`;

      default:
        return html`<input id="input" class="input" type="${this.type}" placeholder="${ifDefined(this.pla)}" @input="${this._handleInput}" @change="${this._handleChange}" />`;
    }
  }
}

export default BaseInput;
declare global {
  interface HTMLElementTagNameMap {
    "base-input": BaseInput;
  }
}
