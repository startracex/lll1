import { css, html, property } from "../../deps.js";
import { htmlSlot, type HTMLTemplate } from "../../lib/templates.js";
import { define } from "../../root.js";
import { type Direction8, OpenableElement } from "./open.js";

const defineName = "open-tooltip";

/**
 * OpenTooltip provide tooltip for slot elements, summary as the tips content.
 *
 * Content can be opened in 8 directions.
 */
@define(defineName)
export class OpenTooltip extends OpenableElement {
  direction: Direction8 | "";
  /**
   * Tip content align.
   */
  @property() align: "center" | "flex-star" | "flex-end" | "" = "";

  static styles = [
    css`
      :host {
        display: inline-flex;
        transition: 0.3s ease-in-out;
        justify-content: center;
      }

      main {
        display: inline-flex;
        align-items: center;
        position: relative;
        transition: inherit;
      }

      main,
      aside {
        transition: inherit;
        white-space: nowrap;
      }

      aside {
        opacity: 0;
        position: absolute;
        transition-property: opacity;
      }

      :host(:hover) aside,
      :host([open]) aside {
        opacity: 1;
      }
    `,
    css`
      aside[class^="top"] {
        bottom: 100%;
      }
      aside[class^="bottom"] {
        top: 100%;
      }
      aside[class$="right"] {
        left: 100%;
      }
      aside[class$="left"] {
        right: 100%;
      }
    `,
  ];

  protected render(): HTMLTemplate {
    return html`<main style="justify-content:${this.align || "inherit"}">
      ${htmlSlot()}
      <aside class="${this.direction || "top"}">${this.summary || htmlSlot("summary")}</aside>
    </main>`;
  }

  connectedCallback() {
    super.connectedCallback();
  }
}

export default OpenTooltip;

declare global {
  interface HTMLElementTagNameMap {
    "open-tooltip": OpenTooltip;
  }
}
