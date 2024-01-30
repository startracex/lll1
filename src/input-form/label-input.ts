import { css, type CSSResultGroup, html, ifDefined, property, query } from "../deps.js";
import { cssvarValues, define } from "../root.js";
import { htmlSlot, htmlStyle, type HTMLTemplate, svgEye } from "../lib/templates.js";
import { InputSTD, type InputType } from "./std.js";

const defineName = "label-input";

@define(defineName)
export class LabelInput extends InputSTD {
  @property({ reflect: true }) type: InputType = "text";
  @property({ type: Boolean }) autofocus = false;
  @property() m = "540px";
  @query("input") _input: HTMLInputElement;
  static styles = [
    InputSTD.styles,
    css`
      :host {
        background-color: inherit;
        display: block;
        border-radius: var(${cssvarValues.input}--radius);
        max-width: calc(var(${cssvarValues.input}--width) * 2);
        margin: auto;
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
        white-space: nowrap;
      }

      input {
        padding: 0 0.25em;
        background-color: transparent;
        border-radius: inherit;
        flex: 1;
        width: 100%;
        height: inherit;
      }

      fieldset:focus-within {
        outline: var(${cssvarValues.input}--outline);
      }

      i {
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      i > svg {
        height: 1em;
        width: 1em;
        margin: 0.25em;
      }

      fieldset {
        position: relative;
        background-color: var(${cssvarValues.input}--background);
        display: flex;
        align-items: center;
        border-radius: inherit;
        height: var(${cssvarValues.input}--height);
        width: var(${cssvarValues.input}--width);
      }

      ::-ms-reveal {
        display: none;
      }
    `,
  ] as CSSResultGroup;

  protected render(): HTMLTemplate {
    const style = this.m && `@media screen and (max-width: ${this.m}) {label[for] {justify-content: flex-start;flex-direction: column;align-items: inherit;width: fit-content;}`;
    return html`<label for="${this.name}">
      <span>${this.label}${htmlSlot()}</span>
      <fieldset>
        <i>${htmlSlot("pre")}</i>
        <input @input="${this._handleInput}" @change="${this._handleChange}" id="${this.name}" type="${this.type}" placeholder="${ifDefined(this.pla)}" class="${this.type}" />
        ${this.renderSuf()}
      </fieldset>
      ${htmlStyle(style)}
    </label>`;
  }

  private renderSuf(): HTMLTemplate {
    if (this.type === "password") {
      return html`<i
        @mousedown="${this._passwordSwitcher}"
        @mouseup="${() => {
          this._changeInputType("password");
        }}"
        @mouseleave="${() => {
          this._changeInputType("password");
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
      this._changeInputType(this.type);
    } else {
      this._changeInputType("password");
    }
  }
}

export default LabelInput;

declare global {
  interface HTMLElementTagNameMap {
    "label-input": LabelInput;
  }
}
