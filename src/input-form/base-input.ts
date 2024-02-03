import { css, type CSSResultGroup, html, property, query } from "../deps.js";
import { cssvar, cssvarValues, define } from "../root.js";
import { htmlSlot, type HTMLTemplate } from "../lib/templates.js";
import { InputSTD } from "./std.js";

const defineName = "base-input";

/**
 * BaseInput.
 */
@define(defineName)
export class BaseInput extends InputSTD {
  /**
   * Input sccept.
   */
  @property() accept = undefined;
  /**
   * Value.
   */
  @property() value: string | File | FileList = undefined;
  /**
   * Only single files are allowed to be selected.
   */
  @property({ type: Boolean }) only = false;
  /**
   * Input min.
   */
  @property({ type: Number }) min = 0;
  /**
   * Input max.
   */
  @property({ type: Number }) max = 100;
  /**
   * Input step.
   */
  @property({ type: Number }) step = 1;

  @query("#input") _input: HTMLInputElement;
  @query(".range i") _ranged: HTMLElement;

  static styles = [
    InputSTD.styles,
    css`
      :host {
        width: var(${cssvarValues.input}--width);
        height: var(${cssvarValues.input}--height);
        background: var(${cssvarValues.input}--background);
        margin: var(--godown--input--outline-width);
        outline: var(${cssvarValues.input}--outline);
        border-radius: var(${cssvarValues.input}--radius);
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
        background: var(${cssvarValues.input}--false);
        border-radius: 2em;
      }

      .range b:nth-of-type(1) {
        width: 1em;
        left: 0;
        background: var(${cssvarValues.input}--true);
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
        background: var(${cssvarValues.input}--true);
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
        background: var(${cssvarValues.input}--control);
        border-radius: 50%;
        border: solid 0.125em var(${cssvarValues.input}--control-edge);
        box-shadow: 0 0.1em 0.1em var(${cssvar}--shadow);
      }
    `,
  ] as CSSResultGroup;

  protected render(): HTMLTemplate {
    if (this.type === "range") {
      return html`<div class="range">
        <input id="input" type="range" min="${this.min}" max="${this.max}" step="${this.step}" @input="${this._handleRange}" @change="${this._handleRange}" />
        <b></b>
        <b>
          <i></i>
        </b>
      </div>`;
    }
    return html`<label for="input"> ${htmlSlot("pre")} ${this._typeSwitcher()} ${htmlSlot("suf")} </label>`;
  }

  connectedCallback() {
    super.connectedCallback();
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
    super.firstUpdated();
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
        return html`<input id="input" class="input" type="file" accept="${this.accept}" ?multiple="${!this.only}" @change="${this._handleFile}" />${htmlSlot()}`;

      case "number":
        return html`<input .value="${this.value}" ?autofocus="${this.autofocus}" id="input" class="input" type="number" placeholder="${this.pla}" min="${this.min}" max="${this.max}" @input="${this._handleInput}" @change="${this._handleChange}" />`;

      default:
        return html`<input .value="${this.value}" ?autofocus="${this.autofocus}" id="input" class="input" type="${this.type}" placeholder="${this.pla}" @input="${this._handleInput}" @change="${this._handleChange}" />`;
    }
  }
}

export default BaseInput;

declare global {
  interface HTMLElementTagNameMap {
    "base-input": BaseInput;
  }
}
