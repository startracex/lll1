import { css, html, property } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { ifValue } from "../../lib/directives.js";
import { htmlSlot } from "../../lib/directives.js";
import { GodownElement } from "../../proto/godown-element.js";
import { createScope } from "../../styles/global.js";

const protoName = "divider";
const cssScope = createScope(protoName);

/**
 * {@linkcode Divider} similar to hr.
 */
@godown(protoName)
@styles(css`
  :host {
    --${cssScope}--before-length: auto;
    --${cssScope}--after-length: auto;
    --${cssScope}--breadth: .05em;
    display: block;
    background: none;
    margin: auto;
  }
  :host([vertical]) {
    width: -moz-fit-content;
    width: fit-content;
    height: 100%;
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
  .horizontal {
    display: flex;
  }

  .vertical {
    display: flex;
    height: 100%;
    flex-direction: column;
  }
  .horizontal hr {
    height: var(--${cssScope}--breadth);
  }
  .horizontal .before {
    max-width: var(--${cssScope}--before-length);
  }
  .horizontal .after {
    max-width: var(--${cssScope}--after-length);
  }
  .vertical hr {
    width: var(--${cssScope}--breadth);
  }
  .vertical .before {
    max-height: var(--${cssScope}--before-length);
  }
  .vertical .after {
    max-height: var(--${cssScope}--after-length);
  }
`)
export class Divider extends GodownElement {
  /**
   * Enable vertical.
   */
  @property({ type: Boolean, reflect: true }) vertical = false;

  protected render() {
    const hasElement = this.childElementCount || this.textContent;
    return html`<div part="root" class="${this.vertical ? "vertical" : "horizontal"}">
      ${ifValue(
        hasElement,
        html`<hr part="before" class="before" />
          ${htmlSlot()}
          <hr part="after" class="after" />`,
        html`<hr part="cross" />`,
      )}
    </div>`;
  }
}

export default Divider;
