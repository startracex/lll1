import { css, html } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { ifValue } from "../../lib/directives.js";
import { htmlSlot } from "../../lib/directives.js";
import GodownElement from "../../proto/godown-element.js";
import { createScope, cssGlobalVars } from "../../styles/global.js";

const protoName = "card";
const cssScope = createScope(protoName);

/**
 * {@linkcode Card} renders a card.
 */
@godown(protoName)
@styles([
  css`
    :host {
      --${cssScope}--border-width: 1px;
      --${cssScope}--border-color: transparent;
      --${cssScope}--background: var(--${cssGlobalVars.background});
      --${cssScope}--divider-width: 100%;
      --${cssScope}--divider-height: var(--${cssScope}--border-width);
      --${cssScope}--divider-background: rgb(54 54 54);
      --${cssScope}--padding: .75em;
      color: var(--${cssGlobalVars.foreground});
      background: var(--${cssScope}--background);
      border: solid var(--${cssScope}--border-width) var(--${cssScope}--border-color);
      display: block;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      border-radius: 0.25em;
      transition: 0.3s ease-in-out;
    }

    :host(:hover) {
      --${cssScope}--border-color:var(--${cssScope}--divider-background);
    }

    hr {
      margin: auto;
      width: var(--${cssScope}--divider-width);
      height: var(--${cssScope}--divider-height);
      background: var(--${cssScope}--divider-background);
    }

    slot {
      display: block;
      padding: var(--${cssScope}--padding);
    }
  `,
])
export class Card extends GodownElement {
  protected render() {
    const HEADER = "header";
    const FOOTER = "footer";
    return html`
      ${ifValue(
        this.querySlot(HEADER),
        html`
          ${htmlSlot(HEADER)}
          <hr />
        `,
      )}
      ${htmlSlot()}
      ${ifValue(
        this.querySlot(FOOTER),
        html`
          <hr />
          ${htmlSlot(FOOTER)}
        `,
      )}
    `;
  }
}

export default Card;
