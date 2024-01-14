import { createScope, css, define, html, property, query, state } from "../deps.js";
import { htmlSlot, type HTMLTemplate } from "../tmpl.js";
import EffectSTD from "./std.js";

const defineName = "typewriter-text";
const cssvarScope = createScope(defineName);

@define(defineName)
export class TypewriterText extends EffectSTD {
  @property() text = "";
  @property({ type: Boolean }) stopped = false;
  @property({ type: Boolean }) ended = false;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) min = 50;
  @property({ type: Number }) delay = 0;
  @property({ type: Number }) index = 0;
  @state() content = "";
  timeoutID: number;
  @query("i") _i: HTMLElement;

  get len() {
    return this.text.length;
  }

  static styles = [
    css`
      :host {
        ${cssvarScope}--cursor-width: .05em;
        font-family: monospace;
        white-space: nowrap;
      }

      i {
        border-right: var(${cssvarScope}--cursor-width) solid;
        margin-left: 0.02em;
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

      slot {
        display: none;
      }

      .hidden {
        visibility: hidden;
      }
    `,
  ];

  protected render(): HTMLTemplate {
    return html`${htmlSlot()}${this.content}<i class="${(this.ended && "hidden") || ""}"></i>`;
  }

  protected firstUpdated() {
    if (!this.text) {
      this.text = this.assignedNodes[0]?.textContent.trim() || "";
    }
    if (!this.stopped && this.len) {
      this.write();
    }
  }

  write(at = this.index) {
    this.content = this.text.slice(0, at + 1);
    const timeout = this.delay || random(this.max, this.min);
    this.timeoutID = setTimeout(() => {
      const nx = at + 1;
      if (nx <= this.len) {
        this.index = nx;
        this.write();
      }
    }, timeout);
  }

  stop() {
    clearTimeout(this.timeoutID);
  }

  end() {
    this.ended = true;
  }
}

function random(m = 0, n = 1) {
  return Math.random() * (n - m) + m;
}

export default TypewriterText;
declare global {
  interface HTMLElementTagNameMap {
    "typewriter-text": TypewriterText;
  }
}
