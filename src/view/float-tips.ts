import { css, html, state } from "../deps.js";
import { htmlSlot, type HTMLTemplate } from "../lib/templates.js";
import { define } from "../root.js";
import OpenAble from "./std.js";

type Direction8 = "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

const defineName = "float-tips";

/**
 * FloatTips uses a named slot to set the location of openable content.
 */
@define(defineName)
export class FloatTips extends OpenAble {
  /**
   * Direction of appearance.
   */
  @state() direction: Direction8 | Direction8[] = "top";

  static styles = [
    css`
      :host {
        display: inline-flex;
      }
      main {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }
      aside {
        visibility: hidden;
        position: absolute;
      }
      :host([open]) aside {
        visibility: visible;
      }
    `,
    css`
      aside[class^="top"] {
        top: -100%;
      }
      aside[class^="bottom"] {
        bottom: -100%;
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
    return html`<main>
      ${(Array.isArray(this.direction) ? this.direction : [this.direction]).map((i) => {
        return html`
          <aside class="${i}">
            <slot name="${i}"></slot>
          </aside>
        `;
      })}
      ${htmlSlot()}
    </main>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEvent(window, "click", (e) => {
      if (this.contains(e.target as Node)) {
        return;
      }
      this.close();
    });
  }

  protected firstUpdated() {
    if (this.on) {
      this.addEvent(this._slot, this.on, () => {
        this.toggle();
      });
    }
  }
}

export default FloatTips;

declare global {
  interface HTMLElementTagNameMap {
    "float-tips": FloatTips;
  }
}
