import { css, html, property } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { htmlSlot } from "../../lib/directives.js";
import GodownSuperOpenable, { type Direction8 } from "../../proto/super-openable.js";
import { createScope } from "../../styles/global.js";

const protoName = "tooltip";
const cssScope = createScope(protoName);

/**
 * {@linkcode Tooltip} provide tooltip for slot elements.
 *
 * Content can be opened in 8 directions.
 *
 * @slot tooltip - Tooltip element.
 * @slot - Tooltip trigger.
 *
 */
@godown(protoName)
@styles([
  css`
    :host {
      --${cssScope}--tooltip-gap: .15em;
      transition: 0.3s ease-in-out;
      border-radius: 0.25em;
      display: block;
      height: 100%;
    }

    [part="root"] {
      display: flex;
      position: relative;
      transition: inherit;
      border-radius: inherit;
    }

    [part="tooltip"] {
      z-index: 1;
      opacity: 0;
      width: -moz-fit-content;
      width: fit-content;
      height: -moz-fit-content;
      height: fit-content;
      position: absolute;
      visibility: hidden;
      transition: inherit;
      pointer-events: none;
      border-radius: inherit;
      transition-property:opacity;
    }

    :host(:hover) [part="tooltip"],
    :host([open]) [part="tooltip"] {
      visibility: visible;
      animation: open .8s forwards;
    }
    @keyframes open {
      50% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  `,
  css`
    [direction^="top"] {
      bottom: 100%;
      padding-bottom: var(--${cssScope}--tooltip-gap);
    }
    [direction^="bottom"] {
      top: 100%;
      padding-top: var(--${cssScope}--tooltip-gap);
    }
    [direction$="right"] {
      left: 100%;
      padding-left: var(--${cssScope}--tooltip-gap);
    }
    [direction$="left"] {
      right: 100%;
      padding-right: var(--${cssScope}--tooltip-gap);
    }
  `,
])
export class Tooltip extends GodownSuperOpenable {
  /**
   * Open direction.
   */
  @property() direction: Direction8 = "top";
  /**
   * Content align.
   */
  @property() align: keyof typeof Tooltip.aligns | "inherit" = "center";

  static aligns = {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    "flex-start": "flex-start",
    "flex-end": "flex-end",
  };

  protected render() {
    const align = Tooltip.aligns[this.align] || "inherit";
    return html`<div part="root" class="root" style="justify-content:${align};align-items:${align}">
      ${htmlSlot()}
      <div part="tooltip" direction="${this.direction}">${htmlSlot("tooltip")}</div>
    </div>`;
  }
}

export default Tooltip;
