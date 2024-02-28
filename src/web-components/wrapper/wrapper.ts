import { css, html, property } from "../../.deps.js";
import { define } from "../../decorators/define.js";
import { htmlSlot, type HTMLTemplate } from "../../lib/templates.js";
import { icons } from "../../lib/templates.js";
import { GodownElement } from "../../supers/root.js";

const defineName = "wrapper";

/**
 * WithWrap is used for wrap content.
 */
@define(defineName)
export class Wrapper extends GodownElement {
  /**
   * Behavioral basis.
   */
  @property() with: string | keyof typeof icons | "expand" | "icon" = "";
  /**
   * Rendered content or slot name.
   */
  @property() wrap: string | keyof typeof icons = "";

  static styles = [
    css`
      :host {
        display: flex;
        width: 1em;
        height: 1em;
      }
    `,
    css`
      i {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        --e: 0.05em;
      }

      i::before,
      i::after {
        content: "";
        display: block;
        width: 100%;
        height: 0.05em;
        background: currentColor;
        transition: 0.3s;
      }

      i::after {
        transform: translate(0, calc(var(--e) / -2)) rotate(-45deg);
      }

      i::before {
        transform: translate(0, calc(var(--e) / 2)) rotate(45deg);
      }

      .close::after {
        transform: translate(0, var(--e));
      }

      .close::before {
        transform: translate(0, calc(var(--e) * -1));
      }

      .close {
        --e: 0.15em;
      }
    `,
  ];

  protected render(): HTMLTemplate {
    switch (this.with) {
      case "expand":
        return html`<i class="${this.wrap || "close"}"></i>`;
      case "icon":
        return icons[this.wrap]?.();
      default:
        return htmlSlot(this.with || this.wrap);
    }
  }
}

export default Wrapper;

declare global {
  interface HTMLElementTagNameMap {
    "wrap-view": Wrapper;
    "with-wrap": Wrapper;
    "g-wrapper": Wrapper;
  }
}
