import { css, html, property } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { part } from "../../decorators/part.js";
import { styles } from "../../decorators/styles.js";
import { constructCSSObject } from "../../lib/css.js";
import { htmlSlot, htmlStyle } from "../../lib/directives.js";
import { GodownElement } from "../../proto/godown-element.js";
import { colorValues, createScope } from "../../styles/global.js";

const protoName = "button";
const cssScope = createScope(protoName);

const whiteFont = colorValues.lightgray[0];
const blackFont = colorValues.darkgray[6];

const colors = constructCSSObject(
  ["color", "background", "gradients"].map((k) => `--${cssScope}--${k}`),
  {
    black: [
      whiteFont, // color
      colorValues.darkgray[7], // background
      colorValues.darkgray[4], // gradients
    ],
    gray: [
      whiteFont, // color
      colorValues.darkgray[1], // background
      colorValues.lightgray[8], // gradients
    ],
    white: [
      blackFont, // color
      colorValues.lightgray[3], // background
      colorValues.lightgray[0], // gradients
    ],
    blue: [
      whiteFont, // color
      colorValues.blue[6], // background
      colorValues.blue[4], // gradients
    ],
    green: [
      whiteFont, // color
      colorValues.green[6], // background
      colorValues.green[4], // gradients
    ],
    red: [
      whiteFont, // color
      colorValues.red[6], // background
      colorValues.red[4], // gradients
    ],
    orange: [
      whiteFont, // color
      colorValues.orange[6], // background
      colorValues.orange[4], // gradients
    ],
    pink: [
      whiteFont, // color
      colorValues.pink[6], // background
      colorValues.pink[4], // gradients
    ],
    purple: [
      whiteFont, // color
      colorValues.purple[6], // background
      colorValues.purple[4], // gradients
    ],
    yellow: [
      blackFont, // color
      colorValues.yellow[6], // background
      colorValues.yellow[4], // gradients
    ],
    teal: [
      whiteFont, // color
      colorValues.teal[6], // background
      colorValues.teal[4], //gradients
    ],
  },
  () => `:host`,
);

/**
 * {@linkcode Button}.
 *
 * Inspired by Next-ui.
 */
@godown(protoName)
@styles([
  css`
    :host(:not([disabled]):active) {
      transform: scale(var(--${cssScope}--focus-scale));
    }

    :host([round]) {
      --${cssScope}--padding-x: .75em;
      border-radius: calc(infinity * 1px);
    }

    :host([disabled]) {
      cursor: not-allowed;
      filter: brightness(0.85);
    }

    :host([ghost]) {
      --${cssScope}--modal-background: var(--${cssScope}--ghost-color);
      border-color: var(--${cssScope}--ghost-color);
      border-width: var(--${cssScope}--ghost-width);
      color: var(--${cssScope}--ghost-color);
      background: transparent;
      border-style: solid;
    }
  `,
  css`
    :host {
      --${cssScope}--padding-x: .5em;
      --${cssScope}--padding: .1em var(--${cssScope}--padding-x);
      --${cssScope}--modal-animation-duration: 1s;
      --${cssScope}--ghost-width: .08em;
      --${cssScope}--focus-scale: .97;
      --${cssScope}--deg: 45deg;
      --${cssScope}--ghost-color:var(--${cssScope}--background);
      color: var(--${cssScope}--color, inherit);
      background: linear-gradient(
        var(--${cssScope}--deg),
        var(--${cssScope}--background),
        var(--${cssScope}--gradients, var(--${cssScope}--background))
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
      border-radius: inherit;
      -webkit-user-select: none;
              user-select: none;
      transition: none;
      transition-duration: inherit;
    }

    [part="slot"] {
      padding: var(--${cssScope}--padding);
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
      background: var(--${cssScope}--modal-background, currentColor);
      animation-duration: var(--${cssScope}--modal-animation-duration);
    }

    @keyframes kf {
      0% {
        transform: scale(0) translate(-50%, -50%);
        opacity: var(--${cssScope}--modal-opacity, 0.18);
      }
      80% {
        transform: scale(1) translate(-50%, -50%);
      }
      to {
        opacity: 0;
      }
    }
  `,
])
export class Button extends GodownElement {
  /**
   * Whether to disable this element.
   */
  @property({ type: Boolean, reflect: true }) disabled: boolean;
  /**
   * Invert font and background color.
   */
  @property({ type: Boolean, reflect: true }) ghost: boolean;
  /**
   * Whether this element is active or not.
   */
  @property({ type: Boolean, reflect: true }) active: boolean;
  /**
   * Enables rounded corners to appear capsule shaped.
   */
  @property({ type: Boolean, reflect: true }) round: boolean;
  /**
   * The primary color.
   */
  @property({ reflect: true }) color: "none" | keyof typeof colors = "black";
  /**
   * Text inside.
   */
  @property() text: string;

  @part("modal-root") _modalRoot: HTMLElement;
  @part("root") _root: HTMLElement;

  protected render() {
    const color = this.nextColor();
    return html`
      <div part="root">
        <span part="modal-root"></span>
        <div part="slot">${this.text || htmlSlot()}</div>
      </div>
      ${htmlStyle(colors[color])}
    `;
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
    this.addEvent(this, "click", this._handelClick, true);
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
