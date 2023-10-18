import { classMap, css, CSSResultGroup, cssvar, define, html, property, query } from "../deps.js";
import type { InputType } from "./std.js";
import STD from "./std.js";
@define("exp-input")
export class ExpInput extends STD {
  static styles = [
    STD.styles,
    css`
      :host {
        line-height: normal;
        display: inline-block;
        width: var(${cssvar}--input-width);
        color: var(${cssvar}--text);
        border-color: var(${cssvar}--input-outline);
        border-radius: 0.2em;
      }
      .input:focus {
        ${cssvar}--input-outline: var(${cssvar}--input-outline-focus) !important;
      }
      div:hover {
        ${cssvar}--input-background: var(${cssvar}--input-background-hover) !important;
      }
      .underline::after,
      .underline::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        bottom: -0.1em;
        width: 100%;
        height: 0.18em;
        bottom: 0;
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
      }
      .underline:focus-within::before {
        z-index: 2;
        width: 100%;
      }
      .underline::before {
        width: 0;
        transition: all 0.2s;
        background: var(${cssvar}--input-outline-focus) !important;
      }
      .underline::after {
        background: var(${cssvar}--input-outline);
      }
      .underline fieldset {
        border-color: transparent !important;
      }
      .outline fieldset {
        border-color: inherit !important;
        border: 0.18em solid;
      }
      .outline .input {
        padding-left: 0.18em;
        padding-right: 0.18em;
      }
      .no-label.filed .input {
        margin-top: 0;
      }
      .filed {
        background: var(${cssvar}--input-background);
        outline: 0.18em solid var(${cssvar}--input-outline);
        height: calc(100% - 0.36em);
        width: calc(100% - 0.36em);
        margin: 0.18em;
      }
      .filed fieldset {
        border-color: transparent !important;
        background: transparent !important;
      }
      :focus ~ fieldset,
      :valid ~ fieldset {
        border-color: var(${cssvar}--input-outline-focus);
      }
      * {
        border-radius: inherit;
        font-size: inherit;
        font-family: inherit;
        transition:
          all 0.2s,
          height 0s;
      }
      div {
        border-color: inherit;
        position: relative;
        width: 100%;
        display: inline-flex;
        min-height: inherit;
      }
      textarea.input {
        resize: vertical;
        height: 1.5em;
        padding-top: 0.3em;
      }
      .input {
        margin-left: 0.18em;
        margin-right: 0.18em;
      }
      .input {
        width: 100%;
        padding-top: 0.2em;
        min-height: 1.7em;
        margin-top: 0.45em;
        margin-bottom: 0.2em;
        border: 0;
        box-sizing: border-box;
        font-size: inherit;
        outline: 0;
        background: transparent;
        z-index: 2;
        overflow-y: hidden;
      }
      fieldset {
        box-sizing: border-box;
        position: absolute;
        background: var(${cssvar}--input-background);
        pointer-events: none;
        padding: 0px;
        position: absolute;
        height: 100%;
        margin: 0;
        width: inherit;
      }
      legend span {
        white-space: nowrap;
        display: inline-block;
        padding: 0 0.2em;
        background: var(${cssvar}--input-background);
        font-size: inherit;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
      legend {
        width: 0;
        height: 1em;
        transform: translateY(0.8em);
      }
      .filed span {
        background: transparent;
      }
      :focus + fieldset legend,
      :valid + fieldset legend {
        transform: translateY(-0.19em) scale(0.7);
      }
    `,
  ] as CSSResultGroup[];
  @property() label = "";
  @property() name = "";
  @property() pla = undefined;
  @property() type: InputType | "textarea" = "text";
  @property() value = "";
  @property() def = "";
  @property() base: "outline" | "filed" | "underline" = "outline";
  @property() offset = "";
  @property({ type: Boolean }) autofocus = false;
  @query(".input") _input: HTMLInputElement;
  render() {
    if (!this.name) this.name = this.label?.toLowerCase() || this.type;
    return html`<div class=${classMap({ [this.base]: true, "no-label": !this.label })}>
      ${this.type !== "textarea" ? html`<input class="input" required title="" value=${this.value} @input=${this._handleInput} @change=${this._handleChange} type=${this.type} placeholder=${this.pla} />` : html`<textarea class="input" required title="" value=${this.value || this.def} @input=${this._handleInput} placeholder=${this.pla}></textarea>`}
      <fieldset>
        <legend><span>${this.label}</span></legend>
      </fieldset>
      <style>
        :valid ~ fieldset legend,
        :focus ~ fieldset legend {
          margin-left: ${this.offset || 0} !important;
        }
      </style>
    </div>`;
  }
}
export default ExpInput;
declare global {
  interface HTMLElementTagNameMap {
    "exp-input": ExpInput;
  }
}
