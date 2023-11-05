import { constructCSS, css, cssvar, define, html, property, unsafeCSS } from "../deps.js";
import { htmlSlot, svgX } from "../tmpl.js";
import ItemsSTD from "./std.js";

const vars = ["color", "background", "border", "super"].map((v) => `${cssvar}--${v}`);
const colors = {
  success: ["#3c763d", "#dff0d8", "#d6e9c6", "#2b542c"],
  info: ["#31708f", "#d9edf7", "#bce8f1", "#245269"],
  warning: ["#8a6d3b", "#fcf8e3", "#faebcc", "#66512c"],
  danger: ["#a94442", "#f2dede", "#ebccd1", "#843534"],
};

@define("alert-item")
export class AlertItem extends ItemsSTD {
  static styles = [
    unsafeCSS(
      constructCSS(vars, colors, (raw) => {
        return `.${raw}`;
      }),
    ),
    css`
      :host {
        margin: 0.1em auto;
        width: 100%;
        display: inline-block;
      }

      .hide {
        opacity: 0;
        transform: translateY(-50%);
      }

      .alert {
        display: flex;
        justify-content: space-between;
        padding: 0.2em 0.5em;
        border: 1px solid;
        border-radius: 4px;
        transition: all 0.25s;
        color: var(${cssvar}--color);
        background-color: var(${cssvar}--background);
        border-color: var(${cssvar}--border);
        animation: alert 0.25s ease-in-out;
      }

      @keyframes alert {
        0% {
          opacity: 0;
          transform: translateY(-50%);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      section.content {
        margin: 0 0.25em 0 0.35em;
        min-height: 1.6em;
        line-height: 1.6em;
      }

      aside.close {
        height: fit-content;
        width: fit-content;
        border-radius: 50%;
        transition: all 0.3s;
      }

      aside.close:hover {
        backdrop-filter: contrast(115%);
      }

      svg {
        display: block;
        height: 1.6em;
        width: 1.6em;
      }

      aside.close:hover path {
        stroke: var(${cssvar}--super);
      }

      path {
        stroke: var(${cssvar}--color);
        transition: all 0.3s;
      }

      .alert ::slotted(a) {
        font-weight: bold;
        color: var(${cssvar}--super);
      }
    `,
  ];
  @property() call: keyof typeof colors | "hide" = "info";
  @property({ type: Number }) autoclose = 3000;
  @property() title = "";
  @property() content = "";

  render() {
    if (this.autoclose) {
      setTimeout(() => this.close(), this.autoclose);
    }
    return html` <div class="${this.call} alert" role="alert">
      <section class="content">
        <strong>
          <slot name="title"></slot>
          ${this.title}</strong
        >
        ${htmlSlot()}${this.content}
      </section>
      <aside class="close" @click="${this.close}">${svgX()}</aside>
    </div>`;
  }

  close() {
    this.shadowRoot.querySelector(".alert").classList.add("hide");
    setTimeout(() => {
      this.remove();
    }, 300);
  }

  static alert(root: HTMLElement, option: Partial<AlertItem>): AlertItem {
    const ai = new AlertItem();
    Object.assign(ai, option);
    root.appendChild(ai);
    return ai;
  }
}

export default AlertItem;
declare global {
  interface HTMLElementTagNameMap {
    "alert-item": AlertItem;
  }
}
