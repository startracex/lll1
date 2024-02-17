import { createScope, cssvarValues, define } from "../root.js";
import { css, type CSSResultGroup, html, property, query, queryAll } from "../deps.js";
import { type HTMLTemplate } from "../lib/templates.js";
import { InputSTD } from "./std.js";

const FOCUS = "focus";

const defineName = "split-input";

const cssScope = createScope(defineName);

/**
 * SplitInput renders multiple inputs.
 */
@define(defineName)
export class SplitInput extends InputSTD {
  /**
   * The number of simulated input boxes.
   */
  @property({ type: Number }) max = 6;
  /**
   * Active index.
   */
  @property({ type: Number }) index = -1;

  @query("input") _input: HTMLInputElement;
  @queryAll("span") _spans: NodeListOf<HTMLSpanElement>;
  current = 0;
  currentValue: (string | null)[] = [];

  static styles = [
    InputSTD.styles,
    css`
      :host {
        ${cssScope}--outline: .15em solid var( ${cssvarValues.input}--outline-color);
        margin: var(${cssvarValues.input}--outline-width);
        width: fit-content;
        border-radius: 1px;
      }

      * {
        font-size: 1em;
        border-radius: inherit;
      }

      div {
        vertical-align: top;
        position: relative;
        display: inline-flex;
        gap: 0.25em;
      }

      span {
        box-sizing: content-box;
        vertical-align: top;
        display: inline-flex;
        width: 1.45em;
        height: 1.45em;
        pointer-events: all;
      }

      i {
        height: inherit;
        width: 100%;
        z-index: 1;
        background-color: var(${cssvarValues.input}--false);
        text-align: center;
      }

      input {
        position: absolute;
        opacity: 0;
        left: 0;
        top: 0;
      }

      .focus i {
        outline: var(${cssScope}--outline);
      }
    `,
  ] as CSSResultGroup;

  protected render(): HTMLTemplate {
    return html`
      <div>
        ${Array(this.max)
          .fill(0)
          .map(() => html`<span><i></i></span>`)}
        <input @input="${this._handleInput}" />
      </div>
    `;
  }

  protected firstUpdated() {
    this.currentValue = this.value.split("").concat(Array(this.max - this.value.length).fill(null));
    this.current = this.index < 0 || this.index > this.max ? this.currentValue.indexOf(null) : this.index;
    this._spans.forEach((span, index) => {
      this.addEvent(span, "click", () => {
        this.current = index;
        this.focusAt();
        this._input.focus();
      });
    });
    this.addEvent(document, "click", (e) => {
      if (!this.contains(e.target as Node)) {
        this.blur();
      }
    });
  }

  protected _handleInput(e: InputEvent) {
    if (e.data === null) {
      if (this.currentValue[this.current] !== null) {
        this.currentValue[this.current] = null;
      } else {
        this.currentValue[this.current - 1] = null;
        this.current = this.current - 1 < 0 ? 0 : this.current - 1;
      }
    } else {
      this.currentValue[this.current] = e.data;
      if (this.current + 1 >= this.max) {
        this.current = this.currentValue.indexOf(null);
        if (this.current === -1) {
          this.blur();
        }
      } else {
        this.current += 1;
      }
    }
    this.focus();
    this._spans.forEach((span, index) => {
      span.querySelector("i").innerText = this.currentValue[index] || "";
    });
    this.value = this.currentValue.join("");
    this.dispatchEvent(new CustomEvent("input", { detail: this.value, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent("change", { detail: this.value, composed: true }));
  }

  focus() {
    this.focusAt();
  }

  focusAt(i = this.current) {
    this._spans.forEach((span) => {
      span.classList.remove(FOCUS);
    });
    this._spans[i]?.classList.add(FOCUS);
    this._input.value = "";
  }

  blur(i = this.current) {
    this._spans[i]?.classList.remove(FOCUS);
    this._input.blur();
  }

  reset() {
    this.currentValue = Array(this.max).fill(null);
    this.current = 0;
    this._spans.forEach((span) => {
      span.querySelector("i").innerText = "";
    });
    this.value = "";
    this.dispatchEvent(new CustomEvent("change", { detail: this.value }));
  }
}

export default SplitInput;

declare global {
  interface HTMLElementTagNameMap {
    "split-input": SplitInput;
  }
}
