import { classMap, css, type CSSResultGroup, html, property, state } from "../deps.js";
import { cssvarValues, define } from "../root.js";
import { type HTMLTemplate } from "../lib/templates.js";
import ItemsSTD from "./std.js";

const defineName = "load-track";

@define(defineName)
export class LoadTrack extends ItemsSTD {
  static styles = [
    ItemsSTD.styles,
    css`
      :host,
      div {
        display: inline-flex;
        position: relative;
        width: 10em;
        height: 0.5em;
        border-radius: 0.25em;
        background: var(${cssvarValues.input}--false);
        z-index: 1;
      }

      div i {
        position: absolute;
        border-radius: inherit;
        top: 0;
        left: 0;
        height: 100%;
        width: 20%;
        background: var(${cssvarValues.cssvar}--accept);
        z-index: 2;
        transition: all 0.3s;
        animation: progress 1.5s ease-in-out infinite alternate;
      }

      @keyframes progress {
        from {
          left: 0;
        }
        to {
          left: 80%;
        }
      }

      div.value i {
        animation: none;
        width: 20%;
      }
    `,
  ] as CSSResultGroup;

  /**
   * The current percentage value, without a percent sign.
   */
  @state() current = 20;
  /**
   * Whether or not there is an actual value for this element.
   */
  @state() hasValue = false;
  /**
   * Maximum.
   */
  @property({ type: Number }) max = 1;
  /**
   * Minimum.
   */
  @property({ type: Number }) min = 0;
  /**
   * If true, the click event will reset the progress.
   */
  @property({ type: Boolean }) modify = false;

  set value(val) {
    if (val === null || val === undefined || val === "") {
      this.removeAttribute("value");
      this.hasValue = false;
    } else {
      this.setAttribute("value", val);
      this.hasValue = true;
    }
    this.current = this.parsePercent(val || 20);
  }

  get value() {
    return this.getAttribute("value");
  }

  protected render(): HTMLTemplate {
    if (this.value !== null) {
      this.hasValue = true;
      this.current = this.parsePercent(this.value);
    }
    return html`<div class="${classMap({ value: this.hasValue })}" @click="${this._handleClick}">
      <i style="width:${this.current}%;"></i>
    </div>`;
  }

  /**
   * Convert s to a percentage without a percent sign.
   *
   * @param s String or number to convert.
   * @returns Percentage without a percent sign.
   */
  parsePercent(s: string | number = "0"): number {
    if (String(s).includes("%")) {
      return parseFloat(String(s));
    }
    return (parseFloat(String(s)) / (this.max - this.min)) * 100;
  }

  protected _handleClick(e: MouseEvent) {
    if (this.modify) {
      this.value = ((e.offsetX / this.offsetWidth) * (this.max - this.min)).toString();
      this.dispatchEvent(new CustomEvent("change", { detail: e.offsetX / this.offsetWidth }));
    }
  }
}

export default LoadTrack;

declare global {
  interface HTMLElementTagNameMap {
    "load-track": LoadTrack;
  }
}
