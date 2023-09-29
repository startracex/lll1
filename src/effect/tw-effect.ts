import { css, define, html, property, state } from "../deps.js";
import STD from "./std.js";
@define("tw-text")
export class TWText extends STD {
  @property() text: string = undefined;
  @property({ type: Boolean }) stopped = false;
  @property({ type: Number }) autochange = 0;
  @property({ type: Number }) max = 50;
  @property({ type: Number }) min = 500;
  @state() len = 0;
  @state() _timer = [];
  static styles = css`
    :host {
      font-family: monospace;
      white-space: nowrap;
    }
    i {
      border-right: 1px solid;
      margin: 1px;
      animation: s 1.5s steps(1) infinite;
    }
    @keyframes s {
      0% {
        border-color: currentColor;
      }
      50% {
        border-color: transparent;
      }
    }
  `;
  render() {
    return html`<slot></slot><i></i>`;
  }
  firstUpdated() {
    if (!this.text) this.text = this.shadowRoot.querySelector("slot").assignedNodes()[0]?.textContent.trim() || "";
    this.len = this.text.length;
    if (!this.stopped && this.len) this.rewrite();
  }
  rewrite() {
    for (const timer of this._timer) {
      clearTimeout(timer);
    }
    this._timer = [];
    const text = this.shadowRoot.querySelector("slot").assignedNodes()[0];
    text.textContent = "";
    let delay = 0;
    let autochange = this.autochange ? this.autochange : random(this.min, this.max);
    this.text.split("").forEach((char) => {
      this._timer.push(
        setTimeout(() => {
          text.textContent += char;
          this.dispatchEvent(new CustomEvent("change"));
          if (this.len === text.textContent.length) {
            this.dispatchEvent(new CustomEvent("done", { detail: delay }));
          }
        }, delay),
      );
      delay += autochange;
      if (!this.autochange) {
        autochange = random(this.min, this.max);
      }
    });
  }
  stop() {
    for (const timer of this._timer) {
      clearTimeout(timer);
    }
    this._timer = [];
  }
}
function random(m = 0, n = 1) {
  return Math.random() * (n - m) + m;
}
export default TWText;
declare global {
  interface HTMLElementTagNameMap {
    "tw-text": TWText;
  }
}
