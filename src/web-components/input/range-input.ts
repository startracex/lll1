import { css, html, property } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { part } from "../../decorators/part.js";
import { styles } from "../../decorators/styles.js";
import { combine, htmlSlot } from "../../lib/directives.js";
import { isNil, joinProperties, notNil } from "../../lib/utils.js";
import GodownInput from "../../proto/super-input.js";
import { createScope, cssGlobalVars } from "../../styles/global.js";
import { inputStyle } from "../../styles/inputStyle.js";

const protoName = "range-input";
const cssScope = createScope(protoName);

/**
 * {@linkcode RangeInput }.
 */
@godown(protoName)
@styles([
  inputStyle,
  css`
    :host {
      background: var(--${cssGlobalVars.input}--background);
      margin: 0.25em var(--${cssGlobalVars.input}--outline-width);
      border-radius: var(--${cssGlobalVars.input}--radius);
      border-radius: var(--${cssGlobalVars.input}--radius);
      --${cssScope}--handle-active: rgb(0 118 200);
      --${cssScope}--track-width: .5em;
      display: inline-block;
      width: var(--${cssGlobalVars.input}--width);
    }

    :host([vertical]) {
      height:  var(--${cssGlobalVars.input}--width);
      width: -moz-fit-content;
      width: fit-content;
    }

    i:hover {
      --${cssScope}--handle-scale:1.08;
    }

    i:active {
      --${cssScope}--handle-scale:1.05;
      background: var(--${cssScope}--handle-active);
    }

    .last-focus {
      z-index: 2;
    }

    [part="root"] {
      min-height:inherit;
      position: relative;
      border-radius: inherit;
      width: 100%;
      --start: 0%;
      --end: 50%;
      height: var(--${cssScope}--track-width);
    }

    [part="track"] {
      min-height:inherit;
      display: flex;
      position: absolute;
      pointer-events: none;
      border-radius: inherit;
      justify-content: space-between;
      left: min(var(--start), var(--end));
      background: var(--${cssGlobalVars.input}--true);
      width: max(calc(var(--end) - var(--start)), calc(var(--start) - var(--end)));
    }

    [part=handle] {
      width: 1em;
      height: 1em;
      display: flex;
      align-items: center;
      justify-content: center;
      -webkit-user-select: none;
              user-select: none;
      position: absolute;
      border: 0.1em solid;
      border-radius: 50%;
      transform-origin: 0% 25%;
      transform: scale(var(--${cssScope}--handle-scale, 1)) translate(-50%, -25%);
      background: var(--${cssGlobalVars.input}--true);
      border-color: var(--${cssGlobalVars.input}--control);
    }
  `,
  css`
    .vertical {
      height: 100%;
      width: var(--${cssScope}--track-width);
    }

    .vertical i {
      transform: translate(-25%, -50%);
    }

    .vertical [part="track"] {
      width: 100%;
      height: max(calc(var(--end) - var(--start)), calc(var(--start) - var(--end)));
      top: min(var(--start), var(--end));
      left: 0;
    }
  `,
  css`
    :host(:not([range])) .start {
      visibility: hidden;
    }

    .start {
      left: var(--start);
      top: 0;
    }

    .end {
      left: var(--end);
      top: 0;
    }

    .vertical .start {
      top: var(--start);
      left: 0;
    }

    .vertical .end {
      top: var(--end);
      left: 0;
    }
  `,
])
export class RangeInput extends GodownInput {
  /**
   * Minimum value.
   */
  @property({ type: Number }) min = 0;
  /**
   * Maximum value.
   */
  @property({ type: Number }) max = 100;
  /**
   * Sliding step length.
   */
  @property({ type: Number }) step = 1;
  /**
   * Enable range sliding.
   */
  @property({ type: Boolean, reflect: true }) range: boolean;

  @property({ type: Boolean, reflect: true }) vertical: boolean;

  /**
   * When `this.range` is true, it should be [number, number], otherwise number.
   */
  @property({ type: Array }) value: number | [number, number];
  /**
   * The default of `this.value`.
   */
  @property({ type: Array }) default: number | [number, number];

  @part("root") _root: HTMLElement;

  lastFocus: undefined | 1 | 2;

  /**
   * Returns true when the second number is greater than the first number
   */
  get reverse() {
    return this.range ? this.value[0] > this.value[1] : false;
  }

  render() {
    const [from, to] = (this.range ? this.value : [0, this.value]) as [number, number];
    const gap = this.max - this.min;
    const style = joinProperties({
      "--start": `${((from - this.min) / gap) * 100}%`,
      "--end": `${((to - this.min) / gap) * 100}%`,
    });
    return html`<div
      part="root"
      class="${combine({
        vertical: this.vertical,
        range: this.range,
        reverse: this.reverse,
      })}"
      @mousedown="${this._handleMousedownRoot}"
      style="${style}"
    >
      <div part="track"></div>
      <i
        part="handle"
        class="${combine(
          {
            "last-focus": this.lastFocus === 1,
          },
          "start",
        )}"
        @mousedown="${this._handleMousedownStart}"
      >
        ${htmlSlot("start")}
      </i>
      <i
        part="handle"
        class="${combine(
          {
            "last-focus": this.lastFocus === 2,
          },
          "end",
        )}"
        @mousedown="${this._handleMousedownEnd}"
      >
        ${htmlSlot("end")}
      </i>
    </div>`;
  }

  _handleMousedownStart(e: MouseEvent) {
    this.createMousedownListener(this.setStart)(e);
  }
  _handleMousedownEnd(e: MouseEvent) {
    this.createMousedownListener(this.setEnd)(e);
  }

  setStart(value: number) {
    this.lastFocus = 1;
    const i = this.value[1];
    this.value = this.range ? [value, i] : value;
  }

  setEnd(value: number) {
    this.lastFocus = 2;
    const i = this.value[0];
    this.value = this.range ? [i, value] : value;
  }

  _computeValue(e: MouseEvent) {
    const rect = this._root.getBoundingClientRect();
    const div = this.vertical ? (e.clientY - rect.top) / rect.height : (e.clientX - rect.left) / rect.width;
    let value = Math.round((div * (this.max - this.min)) / this.step) * this.step;
    if (value > this.max) {
      value -= this.step;
    } else if (value < this.min) {
      value += this.step;
    }
    return value;
  }

  _handleMousedownRoot(e: MouseEvent) {
    const value = this._computeValue(e);
    if (!this.range || Math.abs(value - this.value[0]) > Math.abs(value - this.value[1])) {
      this.setEnd(value);
      this._handleMousedownEnd(e);
    } else {
      this.setStart(value);
      this._handleMousedownStart(e);
    }
  }

  createMousedownListener(mouseMoveCallback: (arg0: number) => void) {
    return (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const move = this.createMousemoveListener(mouseMoveCallback);
      document.addEventListener("mousemove", move);
      const stop = () => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", stop);
      };
      document.addEventListener("mouseup", stop);
    };
  }

  createMousemoveListener(callback: (arg0: number) => void) {
    return (e: MouseEvent) => {
      const value = this._computeValue(e);
      if (value > this.max || value < this.min) {
        return;
      }
      callback?.call(this, value);
    };
  }

  _connectedInit() {
    const gap = this.max - this.min;
    this.step ||= gap / 100;
    if (notNil(this.default) && isNil(this.value)) {
      this.value = this.default;
    } else if (isNil(this.default) && notNil(this.value)) {
      this.default = this.value;
    } else {
      const mid = Math.round(gap / 2 / this.step) * this.step;
      this.default = this.range ? [0, mid] : mid;
      this.value = this.default;
    }
  }

  reset() {
    this.value = this.default;
  }

  swap() {
    if (this.range) {
      const [a, b] = this.value as [number, number];
      this.value = [b, a];
    }
  }

  sort() {
    this.value = this.toSorted();
  }

  toSorted(): number | [number, number] {
    if (this.range) {
      const [a, b] = this.value as [number, number];
      return a > b ? [b, a] : [a, b];
    }
    return this.value;
  }
}

export default RangeInput;
