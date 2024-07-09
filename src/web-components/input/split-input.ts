import { css, html, property, query, queryAll } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { type HTMLEvent } from "../../proto/godown-element";
import GodownSuperInput from "../../proto/super-input.js";
import { createScope, cssGlobalVars } from "../../styles/global.js";
import { inputStyle } from "../../styles/inputStyle.js";

const FOCUS = "focus";

const protoName = "split-input";

const cssScope = createScope(protoName);

/**
 * {@linkcode SplitInput } renders multiple inputs.
 */
@godown(protoName)
@styles([
  inputStyle,
  css`
    :host {
      --${cssScope}--outline: .15em solid var( --${cssGlobalVars.input}--outline-color);
      margin: var(--${cssGlobalVars.input}--outline-width);
      color: var(--${cssGlobalVars.foreground});
      display: inline-block;
      width: -moz-fit-content;
      width: fit-content;
      border-radius: 1px;
    }

    * {
      font-size: 1em;
      border-radius: inherit;
    }

    div {
      gap: 0.25em;
      position: relative;
      vertical-align: top;
      display: inline-flex;
    }

    span {
      width: 1.45em;
      height: 1.45em;
      vertical-align: top;
      display: inline-flex;
      box-sizing: content-box;
    }

    i {
      z-index: 1;
      width: 100%;
      height: inherit;
      text-align: center;
      background-color: var(--${cssGlobalVars.input}--background);
    }

    input {
      width: 100%;
      height: 100%;
      opacity: 0;
      background: none;
      position: absolute;
    }

    .focus i {
      outline: var(--${cssScope}--outline);
    }
  `,
])
export class SplitInput extends GodownSuperInput {
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

  protected render() {
    return html`
      <div part="root">
        ${Array(this.max)
          .fill(0)
          .map(() => html`<span part="outline"><i part="inside"></i></span>`)}
        <input
          part="input"
          id="${this.makeId}"
          @blur=${() => {
            this.blurAt(this.current);
          }}
          @input="${this._handleInput}"
        />
      </div>
    `;
  }

  protected firstUpdated() {
    this.currentValue = this.value.split("").concat(Array(this.max - this.value.length).fill(null));
    this.current = this.index < 0 || this.index > this.max ? this.currentValue.indexOf(null) : this.index;
    this._spans.forEach((span, index) => {
      this.addEvent(span, "click", () => {
        this.current = index;
        this.focusAt(this.current);
        this._input.focus();
      });
    });
  }

  protected _handleInput(e: HTMLEvent<HTMLInputElement>) {
    if (e.data === null) {
      if (this.currentValue[this.current] !== null) {
        this.currentValue[this.current] = null;
      } else {
        this.currentValue[this.current - 1] = null;
        this.current = this.current - 1 < 0 ? 0 : this.current - 1;
      }
    } else {
      this.currentValue[this.current] = e.data as string;
      if (this.current + 1 >= this.max) {
        this.current = this.currentValue.indexOf(null);
        if (this.current === -1) {
          this.blurAt(this.current);
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
    this.focusAt(this.current);
  }

  focusAt(i: number) {
    this._spans.forEach((span) => {
      span.classList.remove(FOCUS);
    });
    this._spans[i]?.classList.add(FOCUS);
    this._input.value = "";
  }

  blur() {
    this.blurAt(this.current);
  }

  blurAt(i: number) {
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
