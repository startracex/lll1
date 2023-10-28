import { classMap, css, CSSResultGroup, cssvar, define, html, property, state } from "../deps.js";
import { htmlSlot } from "../tmpl.js";
import { InputSTD } from "../input-form/std.js";
import ItemsSTD from "./std.js";

@define("load-track")
export class LoadTrack extends ItemsSTD {
  static styles = [
    InputSTD.styles,
    css`
      :host,
      div {
        display: inline-flex;
        position: relative;
        width: 10em;
        height: 0.5em;
        border-radius: 0.25em;
        background-color: var(${cssvar}--input-false);
        z-index: 1;
      }

      div i {
        position: absolute;
        border-radius: inherit;
        top: 0;
        left: 0;
        height: 100%;
        width: 20%;
        background-color: var(${cssvar}--input-true);
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
  ] as CSSResultGroup[];
  @state() current = 20;
  @state() hasValue = false;
  @property({ type: Number }) max = 1;
  @property({ type: Number }) min = 0;
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

  render() {
    if (this.value !== null) {
      this.hasValue = true;
      this.current = this.parsePercent(this.value);
    }
    return html` <div class="${classMap({ value: this.hasValue })}" @click="${this._handleClick}">
      <i style="width:${this.current}%;">${htmlSlot()}</i>
    </div>`;
  }

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
