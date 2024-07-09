import { css, html, property, unsafeCSS } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { constructCSS } from "../../lib/css.js";
import { htmlSlot } from "../../lib/directives.js";
import { svgX } from "../../lib/icons.js";
import { GodownElement } from "../../proto/godown-element.js";
import { createScope } from "../../styles/global.js";

const protoName = "alert";
const cssScope = createScope(protoName);

const currentColor = "currentColor";

const vars = ["color", "background", "border", "super"].map((v) => `--${cssScope}--${v}`);
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
@godown(protoName)
@styles([
  unsafeCSS(constructCSS(vars, colors, (raw) => `.${raw}`)),
  css`
    :host {
      border-radius: var(--${cssScope}--border-radius);
      --${cssScope}--border-radius: 0.4em;
      --${cssScope}--border-width: 0.15em;
      --${cssScope}--padding: .1em;
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
      padding: var(--${cssScope}--padding);
      border-radius: inherit;
      border: var(--${cssScope}--border-width) solid var(--${cssScope}--border);
      color: var(--${cssScope}--color);
      background: var(--${cssScope}--background);
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

    .close {
      height: -moz-fit-content;
      height: fit-content;
      width: -moz-fit-content;
      width: fit-content;
      border-radius: 50%;
      transition: inherit;
    }

    .close:hover {
      -webkit-backdrop-filter: contrast(115%);
              backdrop-filter: contrast(115%);
    }

    .title {
      line-height: 1.5em;
    }
    .close:hover path {
      stroke: var(--${cssScope}--super);
    }
    .flex-1 {
      flex: 1;
    }
    svg {
      display: block;
      height: 1.5em;
      width: 1.5em;
    }
    path {
      stroke: var(--${cssScope}--color);
    }
  `,
])
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

  protected render() {
    if (this.autoclose) {
      setTimeout(() => this.close(), this.autoclose);
    }
    return html`<div part="root" class="${this.call} alert">
      <div class="flex-1">
        <strong part="title" class="title"> ${this.title || htmlSlot("title")}</strong>
        ${this.content || htmlSlot()}
      </div>
      <i class="close" @click="${this.close}">${svgX()}</i>
    </div>`;
  }

  close() {
    this.shadowRoot.querySelector(".alert").classList.add("hide");
    setTimeout(() => {
      this.remove();
    }, 250);
  }

  static alert(root: HTMLElement, option: Partial<Alert>): Alert {
    const ai = new this();
    Object.assign(ai, option);
    root.appendChild(ai);
    return ai;
  }
}

export default Alert;
