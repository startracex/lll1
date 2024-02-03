import { createScope, define } from "../root.js";
import { css, html, property, query, unsafeCSS } from "../deps.js";
import { htmlSlot, type HTMLTemplate } from "../lib/templates.js";
import { constructCSS } from "../lib/utils.js";
import ItemsSTD from "./std.js";

const defineName = "base-button";
const cssvarScope = createScope(defineName);

const shadow1 = "-2px 2px 5px -2px";
const shadow2 = "2px -2px 5px -2px";
const linearGradient = "linear-gradient";
const fff = "#fff";
const _000 = "#000";

const vars = ["color", "background", "box-shadow", "ghost-color"];
const colors = {
  black: [
    fff, //
    `${linearGradient}(45deg, rgb(30 30 30), rgb(65 65 65))`,
    `${shadow1} rgb(0 0 0 / 20%), ${shadow2} rgb(99 99 99 / 20%)`,
    "rgb(22 20 20)",
  ],
  gary: [
    fff, //
    `${linearGradient}(45deg, rgb(65 65 65),  rgb(100 100 100))`,
    `${shadow1} rgb(0 0 0 / 20%), ${shadow2} rgb(99 99 99 / 20%)`,
    "rgb(56 56 56)",
  ],
  white: [
    _000, //
    `${linearGradient}(45deg, rgb(225 225 225), rgb(240 240 240))`,
    `${shadow1} rgb(255 255 255 / 20%), ${shadow2} rgb(165 165 165 / 20%)`,
    "rgb(212 212 212)",
  ],
  red: [
    fff, //
    `${linearGradient}(45deg, rgb(215 57 68), rgb(250 141 106))`,
    `${shadow1} rgb(181 35 44 / 20%), ${shadow2} rgb(234 130 174 / 20%)`,
    "rgb(214 11 23)",
  ],
  green: [
    _000, //
    `${linearGradient}(45deg, rgb(21 206 71), rgb(99 253 122))`,
    `${shadow1} rgb(63 179 69 / 20%), ${shadow2} rgb(136 225 142 / 20%)`,
    "rgb(60 214 68)",
  ],
  blue: [
    fff, //
    `${linearGradient}(45deg, rgb(14 143 255), rgb(121 211 255))`,
    `${shadow1} rgb(92 182 255 / 20%), ${shadow2} rgb(135 232 222 / 20%)`,
    "rgb(42 141 221)",
  ],
  yellow: [
    _000, //
    `${linearGradient}(45deg, rgb(255 190 54), rgb(255 249 68))`,
    `${shadow1} rgb(214 203 55 / 20%), ${shadow2} rgb(202 203 137 / 20%)`,
    "rgb(255 235 59)",
  ],
};

type Colors = keyof typeof colors;

/**
 * BaseButton.
 *
 * Inspired by Next-ui.
 */
@define(defineName)
export class BaseButton extends ItemsSTD {
  /**
   * Whether to disable this element.
   */
  @property({ type: Boolean, reflect: true }) disabled = false;
  /**
   * Invert font and background color.
   */
  @property({ type: Boolean, reflect: true }) ghost = false;
  /**
   * Whether this element is active or not.
   */
  @property({ type: Boolean, reflect: true }) active = false;
  /**
   * Enables rounded corners to appear capsule shaped.
   */
  @property({ type: Boolean, reflect: true }) radius = false;
  /**
   * Enables scale when mousedown.
   */
  @property({ type: Boolean, reflect: true }) scale = false;
  /**
   * The primary color.
   */
  @property() color: "none" | Colors = "black";
  /**
   * Text inside.
   */
  @property() text = "";

  @query("b") _b: HTMLElement;
  @query("div") _div: HTMLButtonElement;

  static styles = [
    unsafeCSS(
      constructCSS(
        vars,
        colors,
        (raw) => `[color=${raw}]`,
        (k, v) => `${cssvarScope}--${k}:${v}`,
      ),
    ),
    css`
      :host {
        ${cssvarScope}--padding: .075em .25em;
        ${cssvarScope}--deg: .075em .25em;
        ${cssvarScope}--ghost-width: .09em;
        ${cssvarScope}--modal-opacity: .15;
        ${cssvarScope}--modal-opacity-end: 0;
        ${cssvarScope}--modal-animation-duration: 1s;
        ${cssvarScope}--focus-scale: .975;
        transition: 0.1s;
        display: flex;
        width: fit-content;
        border-radius: 0.25em;
        cursor: pointer;
        background: none !important;
      }

      :host([disabled]) {
        cursor: not-allowed;
      }

      :host([active][scale]) div {
        scale: var(${cssvarScope}--focus-scale);
      }

      slot {
        display: flow-root;
      }

      div {
        background: var(${cssvarScope}--background);
        box-shadow: var(${cssvarScope}--box-shadow);
        color: var(--godown--base-button--color, inherit);
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        border-radius: inherit;
        transition-duration: inherit;
        transition-property: scale;
        pointer-events: none;
      }

      b {
        pointer-events: none;
        transform: translate(-50%, -50%);
        position: absolute;
        visibility: hidden;
      }

      p {
        padding: var(${cssvarScope}--padding);
        margin: 0;
        user-select: none;
        transition: 0;
      }

      :host([ghost]) p {
        background-image: var(${cssvarScope}--background);
        margin: calc(-1 * var(${cssvarScope}--ghost-width));
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      }

      :host([ghost]) div {
        background: transparent;
        border: var(${cssvarScope}--ghost-width) solid var(${cssvarScope}--ghost-color);
      }

      :host([radius]) {
        border-radius: calc(infinity * 1px);
        ${cssvarScope}--padding: .075em .5em;
      }
    `,
    css`
      i {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        border-radius: 50%;
        transform: translate(0, 0);
        background: currentColor;
        opacity: var(${cssvarScope}--modal-opacity-end);
        visibility: visible;
        animation-duration: min(var(${cssvarScope}--modal-animation-duration), 2s);
      }

      :host([ghost]) i {
        background: var(${cssvarScope}--ghost-color);
      }

      @keyframes i {
        0% {
          transform: scale(0);
          opacity: var(${cssvarScope}--modal-opacity);
        }
        80% {
          transform: scale(1);
        }
        100% {
          opacity: var(${cssvarScope}--modal-opacity-end);
        }
      }
    `,
  ];

  protected render(): HTMLTemplate {
    return html`
      <div color="${this.nextColor()}">
        <b></b>
        <p>${this.text || htmlSlot()}</p>
      </div>
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

  protected firstUpdated() {
    if (this.scale) {
      this.addEvent(this, "mousedown", this.focus);
      this.addEvent(this, "mouseup", (e: MouseEvent) => {
        if (this.disabled) {
          return;
        }
        this.blur();
        this._handleModal(e);
      });
      this.addEvent(this, "mouseleave", this.blur);
      return;
    } else {
      this.addEvent(document, "click", this._handelClick.bind(this));
    }
  }

  protected _handleModal(e: MouseEvent) {
    const a = this._div.offsetHeight + 1;
    const b = this._div.offsetWidth + 1;
    const size = `${Math.sqrt(a * a + b * b) * 2}px`;
    const translate = `translate(calc(-50% + ${e.offsetX}px), calc(-50% + ${e.offsetY}px))`;
    this._b.style.width = size;
    this._b.style.height = size;
    this._b.style.transform = translate;
    const i = document.createElement("i");
    i.style.animationName = "i";
    this._b.appendChild(i);
    setTimeout(() => {
      i.remove();
    }, 2000);
  }

  protected _handelClick(e: MouseEvent) {
    if (this.disabled) {
      return;
    }
    if (e.target === this) {
      this._handleModal(e);
      this.focus();
    } else {
      this.blur();
    }
  }

  /**
   * Get the color to render, default is this.color.
   *
   * @returns New color.
   *
   * Colors can be set for different states.
   *
   * The matching selector is `[color=COLOR]`.
   *
   * @example
   * ```ts
   * button.adoptStyles("[color=COLOR1]{...}")
   * button.adoptStyles("[color=COLOR2]{...}")
   * button.nextColor = () => state ? COLOR1 : COLOR2
   * ```
   */
  nextColor(): Colors | string {
    return this.color;
  }
}

export default BaseButton;

declare global {
  interface HTMLElementTagNameMap {
    "base-button": BaseButton;
  }
}
