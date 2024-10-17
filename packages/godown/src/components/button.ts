import { godown } from "@godown/element/decorators/godown.js";
import { part } from "@godown/element/decorators/part.js";
import { styles } from "@godown/element/decorators/styles.js";
import { htmlSlot } from "@godown/element/directives/html-slot.js";
import { htmlStyle } from "@godown/element/directives/html-style.js";
import { constructCSSObject } from "@godown/element/tools/css.js";
import { css, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";

import { cssGlobalVars, GlobalStyle, scopePrefix } from "../core/global-style.js";

const protoName = "button";
const cssScope = scopePrefix(protoName);

const whiteFont = cssGlobalVars._colors.lightgray[0];
const blackFont = cssGlobalVars._colors.darkgray[6];

const toVar = (s) => {
  return unsafeCSS(`var(${s})`);
};

const colors = constructCSSObject(
  ["color", "background", "gradients"].map((k) => `${cssScope}--${k}`),
  {
    black: [
      whiteFont, // color
      cssGlobalVars._colors.darkgray[7], // background
      cssGlobalVars._colors.darkgray[4], // gradients
    ],
    gray: [
      whiteFont, // color
      cssGlobalVars._colors.darkgray[1], // background
      cssGlobalVars._colors.lightgray[8], // gradients
    ],
    white: [
      blackFont, // color
      cssGlobalVars._colors.lightgray[3], // background
      cssGlobalVars._colors.lightgray[0], // gradients
    ],
    blue: [
      whiteFont, // color
      cssGlobalVars._colors.blue[6], // background
      cssGlobalVars._colors.blue[4], // gradients
    ],
    green: [
      whiteFont, // color
      cssGlobalVars._colors.green[6], // background
      cssGlobalVars._colors.green[4], // gradients
    ],
    red: [
      whiteFont, // color
      cssGlobalVars._colors.red[6], // background
      cssGlobalVars._colors.red[4], // gradients
    ],
    orange: [
      whiteFont, // color
      cssGlobalVars._colors.orange[6], // background
      cssGlobalVars._colors.orange[4], // gradients
    ],
    pink: [
      whiteFont, // color
      cssGlobalVars._colors.pink[6], // background
      cssGlobalVars._colors.pink[4], // gradients
    ],
    purple: [
      whiteFont, // color
      cssGlobalVars._colors.purple[6], // background
      cssGlobalVars._colors.purple[4], // gradients
    ],
    yellow: [
      blackFont, // color
      cssGlobalVars._colors.yellow[6], // background
      cssGlobalVars._colors.yellow[4], // gradients
    ],
    teal: [
      whiteFont, // color
      cssGlobalVars._colors.teal[6], // background
      cssGlobalVars._colors.teal[4], // gradients
    ],
  },
  () => `:host`,
  toVar,
);

/**
 * {@linkcode Button}.
 *
 * @category input
 */
@godown(protoName)
@styles(
  css`
    :host(:not([disabled]):active) {
      transform: scale(var(${cssScope}--focus-scale));
    }

    :host([round]) {
      ${cssScope}--padding-x: .75em;
      border-radius: calc(infinity * 1px);
    }

    :host([disabled]) {
      cursor: not-allowed;
      filter: brightness(0.85);
    }

    :host([ghost]) {
      ${cssScope}--modal-background: var(${cssScope}--ghost-color);
      box-shadow:inset 0px 0px 0px var(${cssScope}--ghost-width) var(${cssScope}--ghost-color);
      color: var(${cssScope}--ghost-color);
      background: transparent;
    }
  `,
  css`
    :host {
      ${cssScope}--padding-x: .5em;
      ${cssScope}--padding-y: .15em;
      ${cssScope}--padding: var(${cssScope}--padding-y) var(${cssScope}--padding-x);
      ${cssScope}--modal-animation-duration: 1s;
      ${cssScope}--ghost-width: .08em;
      ${cssScope}--focus-scale: .97;
      ${cssScope}--deg: 45deg;
      ${cssScope}--ghost-color:var(${cssScope}--background);
      color: var(${cssScope}--color, inherit);
      background: linear-gradient(
        var(${cssScope}--deg),
        var(${cssScope}--background),
        var(${cssScope}--gradients, var(${cssScope}--background))
      );
      border-radius: 0.3em;
      width: -moz-fit-content;
      width: fit-content;
      transition: 0.1s;
      display: block;
      overflow: hidden;
      text-align: center;
      padding: 0 !important;
      cursor: pointer;
    }

    [part="root"] {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
      transition: none;
      user-select: none;
      border-radius: inherit;
      transition-duration: inherit;
    }

    [part="slot"] {
      padding: var(${cssScope}--padding);
    }

    i {
      position: absolute;
      inset: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      visibility: visible;
      pointer-events: none;
      transform-origin: 0 0;
      background: var(${cssScope}--modal-background, currentColor);
      animation-duration: var(${cssScope}--modal-animation-duration);
    }

    @keyframes kf {
      0% {
        transform: scale(0) translate(-50%, -50%);
        opacity: var(${cssScope}--modal-opacity, 0.18);
      }
      80% {
        transform: scale(1) translate(-50%, -50%);
      }
      to {
        opacity: 0;
      }
    }
  `,
)
class Button extends GlobalStyle {
  /**
   * Whether to disable this element.
   */
  @property({ type: Boolean, reflect: true })
  disabled: boolean;
  /**
   * Invert font and background color.
   */
  @property({ type: Boolean, reflect: true })
  ghost: boolean;
  /**
   * Whether this element is active or not.
   */
  @property({ type: Boolean, reflect: true })
  active: boolean;
  /**
   * Enables rounded corners to appear capsule shaped.
   */
  @property({ type: Boolean, reflect: true })
  round: boolean;
  /**
   * The primary color.
   */
  @property({ reflect: true })
  color: "none" | keyof typeof colors = "black";
  /**
   * Text inside.
   */
  @property()
  text: string;

  @part("modal-root")
  _modalRoot: HTMLElement;
  @part("root")
  _root: HTMLElement;

  static colors = colors;

  protected render() {
    const color = this.nextColor();
    return [
      html`<div part="root">
        <span part="modal-root"></span>
        <div part="slot">${this.text || htmlSlot()}</div>
      </div>`,
      htmlStyle(Button.colors[color]),
    ];
  }

  focus() {
    if (this.disabled) {
      return;
    }
    this.active = true;
  }

  blur() {
    this.active = false;
  }

  firstUpdated() {
    this.events.add(this, "click", this._handelClick, true);
  }

  protected _handelClick(e: MouseEvent) {
    if (this.disabled) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    this._handleModal(e);
  }

  protected _handleModal(e: MouseEvent) {
    const modal = document.createElement("i");
    const rect = this.getBoundingClientRect();
    const h = rect.height;
    const w = rect.width;
    const size = `${Math.sqrt(h * h + w * w) * 2}px`;
    modal.style.height = size;
    modal.style.width = size;
    modal.style.left = `${e.clientX - rect.left}px`;
    modal.style.top = `${e.clientY - rect.y}px`;
    modal.style.animationName = "kf";
    this._modalRoot.appendChild(modal);
    modal.addEventListener("animationend", () => modal.remove(), { once: true });
  }

  nextColor() {
    return this.color;
  }
}

export default Button;
