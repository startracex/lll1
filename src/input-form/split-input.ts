import { css, CSSResultGroup, cssvar, define, html, property, query, queryAll } from "../deps.js";
import { InputSTD } from "./std.js";

@define("split-input")
export class SplitInput extends InputSTD {
  static styles = [
    InputSTD.styles,
    css`
      :host {
        ${cssvar}--splited-width: .12em;
        display: inline-flex;
        width: fit-content;
        border-radius: 0.1px;
        font-size: 147%;
      }

      * {
        font-size: 1em;
        border-radius: inherit;
      }

      div {
        vertical-align: top;
        position: relative;
        display: inline-flex;
      }

      span {
        box-sizing: content-box;
        vertical-align: top;
        display: inline-flex;
        width: 1em;
        padding: 0.1em;
        height: 1em;
        pointer-events: all;
      }

      i {
        height: inherit;
        width: 100%;
        z-index: 1;
        background-color: var(${cssvar}--input-false);
        font-style: normal;
        text-align: center;
        font-size: 80%;
        line-height: unset;
      }

      input {
        position: absolute;
        opacity: 0;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
      }

      .focus i {
        outline: var(${cssvar}--splited-width) solid var(${cssvar}--input-true);
      }
    `,
  ] as CSSResultGroup[];
  @property({ type: Number }) max = 6;
  @property({ type: Number }) index = -1;
  @property({ type: Boolean }) autofocus = false;
  @query("input") _input: HTMLInputElement;
  @queryAll("span") _spans: NodeListOf<HTMLSpanElement>;
  current = 0;
  currentValue: (string | null)[] = [];

  render() {
    return html`
      <div>
        ${Array(this.max)
          .fill(0)
          .map(() => html`<span><i></i></span>`)}
        <input @input="${this._handleInput}" value="     " />
      </div>
    `;
  }

  protected firstUpdated() {
    this._focusCheck();
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

  _handleInput(e: InputEvent) {
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
      span.classList.remove("focus");
    });
    this._spans[i]?.classList.add("focus");
    this._input.value = "      ";
  }

  blur(i = this.current) {
    this._spans[i]?.classList.remove("focus");
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
