import { css, html, property } from "../../.deps.js";
import { define } from "../../decorators/define.js";
import { htmlSlot, type HTMLTemplate } from "../../lib/templates.js";
import { createScope, GodownElement } from "../../supers/root.js";

const defineName = "divider";
const cssvarScope = createScope(defineName);

/**
 * {@linkcode Divider} similar to hr.
 */
@define(defineName)
export class Divider extends GodownElement {
  /**
   * Enable vertical.
   */
  @property({ type: Boolean }) v = false;

  static styles = [
    css`
      :host {
        ${cssvarScope}--before-length: auto;
        ${cssvarScope}--after-length: auto;
        ${cssvarScope}--breadth: .125em;
        display: block;
        color: currentColor;
        background: none;
      }

      div {
        display: flex;
        align-items: center;
        border-radius: inherit;
        width: 100%;
      }

      hr {
        border-radius: inherit;
        margin: 0;
        border: 0;
        flex: 1;
        background: currentColor;
      }

      .v {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .before {
        height: var(${cssvarScope}--breadth);
        max-width: var(${cssvarScope}--before-length);
      }
      .after {
        height: var(${cssvarScope}--breadth);
        max-width: var(${cssvarScope}--after-length);
      }
      .v .before {
        width: var(${cssvarScope}--breadth);
        max-height: var(${cssvarScope}--before-length);
      }
      .v .after {
        width: var(${cssvarScope}--breadth);
        max-height: var(${cssvarScope}--after-length);
      }
    `,
  ];

  protected render(): HTMLTemplate {
    return html`<div class="${this.v ? "v" : ""}">
      <hr class="before" />
      ${htmlSlot()}
      <hr class="after" />
    </div>`;
  }
}

export default Divider;

declare global {
  interface HTMLElementTagNameMap {
    "divider-line": Divider;
    "g-divider": Divider;
  }
}
