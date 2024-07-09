import { css, html, property, state } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { ifValue } from "../../lib/directives.js";
import { htmlSlot } from "../../lib/directives.js";
import { svgImage } from "../../lib/icons.js";
import { GodownElement } from "../../proto/godown-element.js";
import { createScope, cssGlobalVars } from "../../styles/global.js";

const protoName = "skeleton";
const cssScope = createScope(protoName);

/**
 * {@linkcode Skeleton} renders a skeleton screen.
 *
 * Inspired by Ant-design.
 *
 * @slot loading - The content if loading is true.
 * @slot - The content if loading is false.
 */
@godown(protoName)
@styles([
  css`
    :host {
      --${cssScope}--from: rgb(var(--${cssGlobalVars.foregroundRGB}) / 7.5%);
      --${cssScope}--to: rgb(var(--${cssGlobalVars.foregroundRGB}) / 22%);
      --${cssScope}--deg: 94deg;
      --${cssScope}--color: rgb(var(--${cssGlobalVars.foregroundRGB}) / 50%);
      --${cssScope}--background: var(--${cssGlobalVars.background});
      --${cssScope}--duration: 1.5s;
      --${cssScope}--icon-width: 5em;
      --${cssScope}--icon-height: 5em;
      --${cssScope}--icon-margin: .75em;
      color: var(--${cssScope}--color);
      background: var(--${cssScope}--background);
      min-height: 1.5em;
      width: 100%;
      flex-shrink: 0;
      display: block;
      overflow: hidden;
    }

    [part="root"] {
      height: 100%;
      min-height: inherit;
      text-align: center;
      animation: var(--${cssScope}--duration) ease-in-out 0s infinite none running;
    }

    svg {
      width: var(--${cssScope}--icon-width);
      height: var(--${cssScope}--icon-height);
      margin: var(--${cssScope}--icon-margin);
    }

    .position {
      background-image: linear-gradient(
        var(--${cssScope}--deg),
        var(--${cssScope}--from) 36%,
        var(--${cssScope}--to) 50%,
        var(--${cssScope}--from) 64%
      );
      background-color: transparent;
      background-size: 200% 100%;
      animation-name: po;
    }

    @keyframes po {
      from {
        background-position: 150% center;
      }
      to {
        background-position: -50% center;
      }
    }

    .opacity {
      background: var(--${cssScope}--from);
      animation-name: op;
      animation-direction: alternate;
    }

    @keyframes op {
      50% {
        opacity: 0.2;
      }
      to {
        opacity: 1;
      }
    }
  `,
])
export class Skeleton extends GodownElement {
  /**
   * Skeleton type.
   */
  @property() type: "text" | "image" = "text";
  /**
   * Animation type.
   */
  @property() animation: "position" | "opacity" = "position";
  /**
   * If false, hidden.
   */
  @state() loading = true;

  protected render() {
    if (!this.loading) {
      return htmlSlot();
    }
    return html`<div part="root" class="${this.animation}">
      ${ifValue(this.type === "image", svgImage(), htmlSlot("loading"))}
    </div>`;
  }
}

export default Skeleton;
