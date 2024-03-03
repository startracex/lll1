import { css, type CSSResultGroup, html, property } from "../../.deps.js";
import { define } from "../../decorators/define.js";
import { ifValue } from "../../lib/directives.js";
import { htmlSlot, type HTMLTemplate } from "../../lib/templates.js";
import { camelToDash, dashToCamel } from "../../lib/utils.js";
import { createScope, GodownElement } from "../../supers/root.js";

const defineName = "text";

const cssvarScope = createScope(defineName);

/**
 * {@linkcode Text } renders nowrap text.
 */
@define(defineName)
export class Text extends GodownElement {
  /**
   * Underline behavior.
   */
  @property() underline: "none" | "hover" | "active" | "always" | "" = "none";
  /**
   * Text format.
   */
  @property() case: "upper" | "lower" | "dash" | "camel" | "raw" | "" = "";
  /**
   * Text.
   */
  @property() text = "";

  static styles: CSSResultGroup = [
    GodownElement.styles,
    css`
      :host {
        ${cssvarScope}--color: currentColor;
        ${cssvarScope}--color-hover: currentColor;
        ${cssvarScope}--color-active: currentColor;
        display: inline-block;
        text-overflow: ellipsis;
        overflow-wrap: break-word;
      }

      span {
        white-space: nowrap;
        display: block;
        text-overflow: inherit;
        overflow-wrap: inherit;
        overflow: hidden;
        color: var(${cssvarScope}--color, inherit);
      }

      span:hover {
        color: var(${cssvarScope}--color-hover, inherit);
      }

      span:active {
        color: var(${cssvarScope}--color-active, inherit);
      }

      .hover:hover,
      .active:active,
      .always {
        text-decoration: underline;
      }

      .none {
        text-decoration: none;
      }
    `,
  ];

  protected render(): HTMLTemplate {
    return html`<span class="${this.underline || "always"}">${ifValue(this.text, this.t(), htmlSlot())}</span>`;
  }

  private t() {
    const text = this.text;
    switch (this.case) {
      case "upper":
        return text.toUpperCase();
      case "raw":
        return text;
      case "lower":
        return text.toLowerCase();
      case "camel":
        return dashToCamel(text);
      case "dash":
        return camelToDash(text);
      default:
        return text[0].toUpperCase() + text.slice(1);
    }
  }
}

export default Text;

declare global {
  interface HTMLElementTagNameMap {
    "g-text": Text;
  }
}
