import { css, CSSResultGroup, cssvar, define, html, ifDefined, property, query } from "../deps.js";
import { htmlSlot, svgEye } from "../tmpl.js";
import { InputSTD, type InputType } from "./std.js";

@define("label-input")
export class LabelInput extends InputSTD {
  @property({ reflect: true }) type: InputType = "text";
  @property({ type: Boolean }) autofocus = false;
  @query("input") _input: HTMLInputElement;
  static styles = [
    InputSTD.styles,
    css`
      :host {
        max-width: calc(2 * var(${cssvar}--input-width));
        background-color: inherit;
        display: block;
        border-radius: 0.2em;
      }

      label {
        margin: auto;
        width: 100%;
        box-sizing: border-box;
        height: fit-content;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: inherit;
      }

      span {
        flex: 1;
      }

      input {
        padding: 0 0.125em;
        background-color: transparent;
        font-size: 102.5%;
        border-radius: inherit;
        flex: 1;
        width: 100%;
        height: inherit;
      }

      fieldset:focus-within {
        outline: 0.18em solid var(${cssvar}--input-outline-color);
      }

      @media screen and (max-width: 540px) {
        label {
          justify-content: flex-start;
          flex-direction: column;
          align-items: flex-start;
          width: fit-content;
        }
      }

      i > svg {
        height: 1em;
        width: 1.5em;
      }

      fieldset {
        color: var(${cssvar}--text);
        position: relative;
        background-color: var(${cssvar}--input-background);
        display: flex;
        align-items: baseline;
        border-radius: inherit;
        outline: none;
        border: 0;
        height: var(${cssvar}--input-height);
        width: var(${cssvar}--input-width);
      }

      ::-ms-reveal {
        display: none;
      }
    `,
  ] as CSSResultGroup[];

  render() {
    return html`<label for="${this.name}">
      <span>${this.label}${htmlSlot()}</span>
      <fieldset>
        <i>${htmlSlot("pre")}</i>
        <input @input="${this._handleInput}" @change="${this._handleChange}" id="${this.name}" type="${this.type}" placeholder="${ifDefined(this.pla)}" class="${this.type}" />
        ${this.render_suf()}
      </fieldset>
    </label>`;
  }

  protected render_suf() {
    if (this.type === "password") {
      return html`<i
        @mousedown="${this._passwordSwitcher}"
        @mouseup="${() => {
          this._input.type = "password";
        }}"
        @mouseleave="${() => {
          this._input.type = "password";
        }}"
      >
        ${!this.querySelector("[slot=suf]") ? svgEye() : htmlSlot("suf")}
      </i>`;
    } else {
      return html`<i>${htmlSlot("suf")}</i>`;
    }
  }

  protected _passwordSwitcher() {
    if (this._input.type === "password") {
      this._input.type = "text";
    } else {
      this._input.type = "password";
    }
  }
}

export default LabelInput;
declare global {
  interface HTMLElementTagNameMap {
    "label-input": LabelInput;
  }
}
