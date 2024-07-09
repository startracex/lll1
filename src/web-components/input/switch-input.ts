import { css, html, property, query } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import GodownInput from "../../proto/super-input.js";
import { cssGlobalVars } from "../../styles/global.js";
import { inputStyle } from "../../styles/inputStyle.js";

const protoName = "switch-input";

/**
 * {@linkcode SwitchInput } renders a switch.
 *
 * Inspired by Steam.
 */
@godown(protoName)
@styles([
  inputStyle,
  css`
    :host {
      --${cssGlobalVars.input}--width: 3em;
      --${cssGlobalVars.input}--height: calc(var(--${cssGlobalVars.input}--width) / 2);
      --${cssGlobalVars.input}--gap: calc(var(--${cssGlobalVars.input}--width) / 25);
      --${cssGlobalVars.input}--transition: all .25s ease-in-out;
      background: var(--${cssGlobalVars.input}--background);
      width: var(--${cssGlobalVars.input}--width);
      height: var(--${cssGlobalVars.input}--height);
      display: inline-block;
      vertical-align: bottom;
    }

    [part="root"],
    span,
    i {
      transition: var(--${cssGlobalVars.input}--transition);
    }

    [part="root"] {
      border-radius: inherit;
      position: relative;
      height: inherit;
    }

    [part="root"],
    input,
    i {
      width: 100%;
    }

    input {
      margin: 0;
      height: 100%;
      outline: none;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
    }

    span {
      height: 100%;
      display: inline-flex;
      position: absolute;
      left: 0;
      width: 50%;
      pointer-events: none;
      border-radius: inherit;
    }

    :host([round]) {
      border-radius: calc(var(--${cssGlobalVars.input}--height) / 2);
    }

    :host([checked]) span {
      transform: translateX(100%);
    }

    .rect * {
      border-radius: inherit;
    }

    .rect .true {
      background: var(--${cssGlobalVars.input}--true);
    }

    .rect .false {
      background: var(--${cssGlobalVars.input}--false);
    }

    .round i {
      border-radius: 100%;
      margin: var(--${cssGlobalVars.input}--gap);
      background: var(--${cssGlobalVars.input}--control);
      width: calc(var(--${cssGlobalVars.input}--height) - var(--${cssGlobalVars.input}--gap) * 2);
      height: calc(var(--${cssGlobalVars.input}--height) - var(--${cssGlobalVars.input}--gap) * 2);
    }

    .round {
      background: var(--${cssGlobalVars.input}--false);
    }

    :host([checked]) .round {
      background: var(--${cssGlobalVars.input}--true);
    }
  `,
])
export class SwitchInput extends GodownInput {
  /**
   * @deprecated
   */
  base: "fat" | "rect";
  /**
   * Border style.
   */
  // @property() variant: "fat" | "rect" = "rect";
  @property({ type: Boolean, reflect: true }) round = false;
  /**
   * Whether this element is selected or not.
   */
  @property({ type: Boolean, reflect: true }) checked = false;
  /**
   * Whether this element is disabled or not.
   */
  @property({ type: Boolean, reflect: true }) disabled = false;
  /**
   * Parsed by JSON.parse to checked.
   */
  @property() default = "false";
  /**
   * Input value.
   */
  @property() value = "on";

  @query("input") _input: HTMLInputElement;

  protected render() {
    return html`<div part="root" class="${this.round ? "round" : "rect"}">
      <input
        part="input"
        @change="${this._handleChange}"
        ?disabled="${this.disabled}"
        ?checked="${this.checked}"
        name="${this.name}"
        id="${this.makeId}"
        type="checkbox"
      />
      <span>
        <i class="${this.checked}"><i></i></i>
      </span>
    </div>`;
  }

  reset() {
    this.checked = this.default === "true";
    this._input.checked = this.checked;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.checked) {
      this.default = "true";
    }
    if (this.default === "true") {
      this.checked = true;
    }
  }

  protected _handleChange() {
    this.checked = this._input.checked;
    this.dispatchEvent(new CustomEvent("input", { detail: this.checked, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent("change", { detail: this.checked, composed: true }));
  }

  namevalue(): [string, boolean] {
    return [this.name, this.checked];
  }
}

export default SwitchInput;
