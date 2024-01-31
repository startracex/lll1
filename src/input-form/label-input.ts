import { css, type CSSResultGroup, html, property, query } from "../deps.js";
import { cssvarValues, define } from "../root.js";
import { htmlSlot, htmlStyle, type HTMLTemplate, svgEye } from "../lib/templates.js";
import { InputSTD } from "./std.js";

const PASSWORD = "password";

const styleInMedia = css`
  label[for] {
    justify-content: flex-start;
    flex-direction: column;
    align-items: inherit;
    width: fit-content;
  }
  :host {
    width: var(${cssvarValues.input}--width);
    margin: auto;
  }
`;

const styleNoLabel = css`
  :host {
    width: var(${cssvarValues.input}--width);
  }
`;

const styleWithLabel = css`
  :host {
    width: calc(var(${cssvarValues.input}--width) * 2);
  }
`;

const defineName = "label-input";

/**
 * When there is a label, the layout will be adjusted according to the width of the screen.
 *
 * Otherwise it behaves similarly to the `BaseInput`.
 */
@define(defineName)
export class LabelInput extends InputSTD {
  /**
   * Conditions for adjust layout.
   */
  @property() m = "540px";

  @query("input") _input: HTMLInputElement;

  static styles = [
    InputSTD.styles,
    css`
      :host {
        border-radius: var(${cssvarValues.input}--radius);
      }

      label {
        width: 100%;
        margin: auto;
        box-sizing: border-box;
        height: fit-content;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: inherit;
      }

      span {
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
        min-width: var(${cssvarValues.input}--width);
      }
    `,
  ] as CSSResultGroup;

  protected render(): HTMLTemplate[] {
    const result = html`<fieldset>
      <i>${htmlSlot("pre")}</i>
      <input .value="${this.value}" ?autofocus="${this.autofocus}" id="${this.name}" type="${this.type}" placeholder="${this.pla}" class="${this.type}" @input="${this._handleInput}" @change="${this._handleChange}" />
      ${this.renderSuf()}
    </fieldset>`;
    if (this.label) {
      const style = this.m && `}${styleWithLabel}@media (max-width: ${this.m}){${styleInMedia}`;
      return [
        html`<label for="${this.name}">
          <span>${this.label}${htmlSlot()}</span>
          ${result}
        </label>`,
        htmlStyle(style),
      ];
    }
    return [result, htmlStyle(styleNoLabel.toString())];
  }

  private renderSuf(): HTMLTemplate {
    if (this.type === PASSWORD) {
      return html`<i
        @mousedown="${this._passwordSwitcher}"
        @mouseup="${() => {
          this._changeInputType(PASSWORD);
        }}"
        @mouseleave="${() => {
          this._changeInputType(PASSWORD);
        }}"
      >
        ${htmlSlot("suf", svgEye(), this)}
      </i>`;
    } else {
      return html`<i>${htmlSlot("suf")}</i>`;
    }
  }

  protected _passwordSwitcher() {
    if (this._input.type === PASSWORD) {
      this._changeInputType("text");
    } else {
      this._changeInputType(PASSWORD);
    }
  }
}

export default LabelInput;

declare global {
  interface HTMLElementTagNameMap {
    "label-input": LabelInput;
  }
}
