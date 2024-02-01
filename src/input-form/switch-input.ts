import { createScope, cssvarValues, define } from "../root.js";
import { css, type CSSResultGroup, html, property, query } from "../deps.js";
import { htmlSlot, type HTMLTemplate } from "../lib/templates.js";
import { InputSTD } from "./std.js";

const defineName = "switch-input";
const cssScope = createScope(defineName);

/**
 * Switch renders a switch.
 *
 * Inspired by Steam.
 */
@define(defineName)
export class SwitchInput extends InputSTD {
  /**
   * Border style.
   */
  @property() base: "fat" | "rect" = "rect";
  /**
   * Whether this element is selected or not.
   */
  @property({ type: Boolean }) checked = false;
  /**
   * Whether this element is disabled or not.
   */
  @property({ type: Boolean }) disabled = false;
  /**
   * Parsed by JSON.parse to checked.
   */
  @property() def = "false";
  /**
   * Input name.
   */
  @property() name = "checkbox";
  /**
   * Input value.
   */
  @property() value = "on";

  @query("input") _input: HTMLInputElement;

  static styles = [
    InputSTD.styles,
    css`
      :host {
        ${cssScope}--width: 3em;
        ${cssScope}--height: calc(var(${cssScope}--width) / 2);
        width: var(${cssScope}--width);
        height: var(${cssScope}--height);
      }

      :host,
      span {
        display: inline-flex;
        font-size: inherit;
        position: relative;
        align-items: center;
        border-radius: inherit;
      }

      span {
        width: inherit;
        height: inherit;
      }

      input {
        width: inherit;
        height: inherit;
        margin: 0;
        outline: none;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        position: relative;
        font-size: inherit;
        background: var(${cssvarValues.input}--false);
        border-radius: inherit;
        transition: all 0.3s;
      }

      aside {
        pointer-events: none;
        transition: 0.3s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        font-size: inherit;
        overflow: hidden;
        border-radius: inherit;
      }

      aside div {
        height: 100%;
      }

      input[disabled] ~ aside {
        filter: brightness(0.87);
      }

      .rect div.always {
        display: none;
      }

      .always {
        position: absolute;
      }

      .rect aside {
        height: 100%;
        width: 100%;
        left: 0;
      }

      .rect .true,
      .rect .false {
        width: 50%;
        text-align: center;
        transition: all 0.3s;
      }

      .rect input:checked ~ aside div.true,
      .rect .false {
        background-color: var(${cssvarValues.input}--true);
      }

      .rect input:checked ~ aside div.false,
      .rect .true {
        background: var(${cssvarValues.input}--false);
      }

      .fat aside {
        width: 1.2em;
        height: 1.2em;
        border-radius: 50%;
        background: var(${cssvarValues.input}--control);
        transition: 0.3s;
        left: 0.15em;
        top: 0.15em;
        bottom: 0.15em;
      }

      .fat {
        border-radius: 0.75em;
      }

      .fat input:checked {
        background: var(${cssvarValues.input}--true);
      }

      .fat input:checked ~ aside {
        left: calc(100% - 0.15em - 1.2em);
        right: 0.15em;
      }

      .fat input:checked ~ aside div.true,
      .fat div.false {
        display: block;
      }

      .fat input:checked ~ aside div.false,
      .fat div.true {
        display: none;
      }
    `,
  ] as CSSResultGroup;

  protected render(): HTMLTemplate {
    return html`<span class="${this.base}">
      <input @change="${this._handleChange}" ?disabled="${this.disabled}" ?checked="${this.checked}" name="${this.name}" type="checkbox" />
      <aside>
        <div class="false"><slot name="false"></slot></div>
        <div class="always">${htmlSlot()}<slot name="always"></slot></div>
        <div class="true"><slot name="true"></slot></div>
      </aside>
    </span>`;
  }

  reset() {
    this.checked = this.def === "true";
    this._input.checked = this.checked;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.checked) {
      this.def = "true";
    } else if (this.def === "true") {
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

declare global {
  interface HTMLElementTagNameMap {
    "switch-input": SwitchInput;
  }
}
