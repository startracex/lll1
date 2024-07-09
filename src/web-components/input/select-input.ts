import { css, html, property } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { htmlSlot } from "../../lib/directives.js";
import { svgDelta, svgX } from "../../lib/icons.js";
import GodownInput from "../../proto/super-input.js";
import { cssGlobalVars } from "../../styles/global.js";
import { fieldStyle, inputStyle } from "../../styles/inputStyle.js";

const protoName = "select-input";

/**
 * {@linkcode SelectInput} select matched elements.
 *
 * This will not support multi-selection operations.
 *
 * @slot - Options.
 */
@godown(protoName)
@styles([
  inputStyle,
  fieldStyle,
  css`
    :host {
      background: var(--${cssGlobalVars.input}--background);
      margin: var(--${cssGlobalVars.input}--outline-width);
      outline: var(--${cssGlobalVars.input}--outline-width) solid transparent;
      border-radius: var(--${cssGlobalVars.input}--radius);
      height: var(--${cssGlobalVars.input}--height);
      width: var(--${cssGlobalVars.input}--width);
      display: block;
    }

    :host([open]) {
      outline-color: var(--${cssGlobalVars.input}--outline-color);
    }

    input {
      flex: 1;
      width: 100%;
      height: 100%;
      cursor: inherit;
      border: inherit;
      background: none;
      padding: 0 0 0 0.25em;
      box-sizing: border-box;
      border-radius: inherit;
    }

    section {
      height: 100%;
      overflow: hidden;
      z-index: inherit;
      border-radius: inherit;
      max-width: calc(100% - 1.2em);
    }

    [part="root"] {
      width: 100%;
      z-index: inherit;
      position: relative;
      display: inline-flex;
      align-items: center;
      border-radius: inherit;
    }

    .content {
      top: 100%;
      position: absolute;
      width: 100%;
      z-index: 1;
      margin-top: 1px;
      visibility: hidden;
      border-radius: inherit;
    }

    :host([open]) .content {
      visibility: visible;
    }
  `,
  css`
    .selected-item {
      background: var(--${cssGlobalVars.input}--true);
      border-radius: inherit;
      height: 100%;
      float: left;
      display: inline-flex;
      font-style: normal;
      align-items: center;
      padding: 0 0.1em 0 0.2em;
    }

    .selected-item i {
      height: -moz-fit-content;
      height: fit-content;
    }
  `,
])
export class SelectInput extends GodownInput {
  /**
   * Open content.
   */
  @property({ type: Boolean, reflect: true }) open = false;

  /**
   * Selected texts.
   */
  @property() text: string;
  /**
   * Selected texts.
   */
  @property({
    attribute: "default-text",
  })
  defaultText: string;

  protected render() {
    return html`<div part="root" class="input-field">
      <section part="selected">
        ${this.value &&
        html`<div class="selected-item">
          ${this.value}
          <i
            @click="${() => {
              this.value = "";
            }}"
            >${svgX()}</i
          >
        </div>`}
      </section>
      <input
        part="input"
        ?autofocus="${this.autofocus}"
        id="${this.makeId}"
        @focus="${() => {
          this.open = true;
        }}"
        @input="${this._handleInput}"
        placeholder="${this.placeholder}"
      />
      <label for="${this.makeId}"> <i>${svgDelta()}</i></label>
      <div class="content" part="slot">${htmlSlot()}</div>
    </div>`;
  }

  protected firstUpdated() {
    super.firstUpdated();
    this.addEvent(document, "click", (e) => {
      const target = e.target as HTMLElement;
      if (!this.contains(e.target as Node)) {
        this.open = false;
      } else if (target !== this) {
        const value = this.getOptionValue(target);
        if (value) {
          this.select(value, target.textContent);
        }
      }
    });
  }

  select(value: string, text?: string) {
    this.value = value;
    this.text = text || value;
    this._input.value = "";
    this.filter();
    this.dispatchEvent(new CustomEvent("change", { detail: this.namevalue() }));
  }

  filter(value?: string) {
    this.querySelectorAll("*").forEach((option: HTMLElement) => {
      const { style } = option;
      if (!value) {
        style.display = null;
        return;
      }
      const optionValue = this.getOptionValue(option);
      if (includesIgnoreCase(optionValue, value) || includesIgnoreCase(option.textContent, value)) {
        style.display = null;
      } else {
        style.display = "none";
      }
    });
  }

  reset() {
    if (this.default) {
      this.select(this.default, this.defaultText || this.default);
    }
  }

  protected _handleInput() {
    this.filter(this._input.value.trim());
    this.dispatchEvent(new CustomEvent("input", { detail: this.namevalue() }));
  }

  focus(options?: FocusOptions) {
    this._input?.focus(options);
    this.open = true;
  }

  getOptionValue(option: Element) {
    return (option as HTMLOptionElement).value || option.getAttribute("value") || "";
  }
  /**
   * @deprecated
   */
  only: boolean;
}

export default SelectInput;

function includesIgnoreCase(a: string, b: string): boolean {
  if (!a || !b) {
    return false;
  }
  return a.toLowerCase().includes(b.toLowerCase());
}
