import { css, html, property } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { combine, htmlSlot } from "../../lib/directives.js";
import { GodownElement } from "../../proto/godown-element.js";
import { createScope, cssGlobalVars } from "../../styles/global.js";

const protoName = "text";

const cssScope = createScope(protoName);

/**
 * {@linkcode Text } renders nowrap text.
 */
@godown(protoName)
@styles([
  css`
    :host {
      --${cssScope}--color: currentColor;
      --${cssScope}--color-hover: currentColor;
      --${cssScope}--color-active: currentColor;
      display: inline-block;
      text-overflow: ellipsis;
      overflow-wrap: break-word;
    }

    span {
      white-space: nowrap;
      width: 100%;
      vertical-align: bottom;
      display: inline-block;
      text-overflow: inherit;
      overflow-wrap: inherit;
      overflow: hidden;
      color: var(--${cssScope}--color, inherit);
    }

    span:hover {
      color: var(--${cssScope}--color-hover, inherit);
    }

    span:active {
      color: var(--${cssScope}--color-active, inherit);
    }

    .hover:hover,
    .active:active,
    .always {
      text-decoration: underline;
    }

    .none {
      text-decoration: none;
    }

    .clip{
      background: var(--${cssGlobalVars.clipBackground});
      display: inline-block;
      color: transparent;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      -webkit-background-clip: text;
    }
  `,
])
export class Text extends GodownElement {
  /**
   * Underline behavior.
   */
  @property() underline: "none" | "hover" | "active" | "always" = "none";

  /**
   * Set background-clip to text.
   */
  @property({ type: Boolean }) clip: boolean;

  protected render() {
    return html`<span
      part="root"
      class="${combine({
        [this.underline || "always"]: true,
        clip: this.clip,
      })}"
    >
      ${htmlSlot()}
    </span>`;
  }
}

export default Text;
