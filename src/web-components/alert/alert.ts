import { css, html, property, unsafeCSS } from "../../.deps.js";
import { define } from "../../decorators/define.js";
import { htmlSlot, type HTMLTemplate, svgX } from "../../lib/templates.js";
import { constructCSS } from "../../lib/utils.js";
import { createScope, GodownElement } from "../../supers/root.js";

const defineName = "alert";
const cssvarScope = createScope(defineName);

const currentColor = "currentColor";

const vars = ["color", "background", "border", "super"].map((v) => `${cssvarScope}--${v}`);
const colors = {
  success: ["#3c763d", "#dff0d8", "#d6e9c6", "#2b542c"],
  info: ["#31708f", "#d9edf7", "#bce8f1", "#245269"],
  warning: ["#8a6d3b", "#fcf8e3", "#faebcc", "#66512c"],
  danger: ["#a94442", "#f2dede", "#ebccd1", "#843534"],
  inherit: [currentColor, "inherit", currentColor, currentColor],
};

/**
 * {@linkcode Alert} renders a alert.
 *
 * Inspired by Ant-design.
 */
@define(defineName)
export class Alert extends GodownElement {
  /**
   * Type of performance.
   */
  @property() call: keyof typeof colors | "hide" = "info";
  /**
   * Close delay.
   */
  @property({ type: Number }) autoclose = 3000;
  /**
   * Alert title.
   */
  @property() title = "";
  /**
   * Alert content.
   */
  @property() content = "";

  static styles = [
    unsafeCSS(
      constructCSS(vars, colors, (raw) => {
        return `.${raw}`;
      }),
    ),
    css`
      :host {
        ${cssvarScope}--padding: .05em .25em .05em .35em;
        ${cssvarScope}--border-width: 0.15em;
        ${cssvarScope}--border-radius: 0.4em;
        border-radius: var(${cssvarScope}--border-radius);
        margin: 0 auto;
        display: block;
      }

      .hide {
        opacity: 0;
        transform: translateY(-100%);
      }

      .alert {
        transition: 0.25s;
        display: flex;
        justify-content: space-between;
        padding: var(${cssvarScope}--padding);
        border-radius: inherit;
        border: var(${cssvarScope}--border-width) solid var(${cssvarScope}--border);
        color: var(${cssvarScope}--color);
        background: var(${cssvarScope}--background);
        animation: alert 0.25s ease-in-out;
      }

      @keyframes alert {
        0% {
          opacity: 0;
          transform: translateY(-50%);
        }
        100% {
          opacity: 1;
          transform: none;
        }
      }

      div {
        min-height: 1.5em;
        line-height: 1.5em;
      }

      .close {
        height: fit-content;
        width: fit-content;
        border-radius: 50%;
        transition: inherit;
      }

      .close:hover {
        backdrop-filter: contrast(115%);
      }

      svg {
        display: block;
        height: 1.6em;
        width: 1.6em;
      }

      .close:hover path {
        stroke: var(${cssvarScope}--super);
      }

      path {
        stroke: var(${cssvarScope}--color);
      }
    `,
  ];

  protected render(): HTMLTemplate {
    if (this.autoclose) {
      setTimeout(() => this.close(), this.autoclose);
    }
    return html`<main class="${this.call} alert">
      <div>
        <strong> ${this.title || htmlSlot("title")}</strong>
        ${this.content || htmlSlot()}
      </div>
      <aside class="close" @click="${this.close}">${htmlSlot("close", svgX(), this)}</aside>
    </main>`;
  }

  close() {
    this.shadowRoot.querySelector(".alert").classList.add("hide");
    setTimeout(() => {
      this.remove();
    }, 250);
  }

  static alert(root: HTMLElement, option: Partial<Alert>): Alert {
    const ai = new Alert();
    Object.assign(ai, option);
    root.appendChild(ai);
    return ai;
  }
}

export default Alert;

declare global {
  interface HTMLElementTagNameMap {
    "alert-item": Alert;
    "g-alert": Alert;
  }
}
