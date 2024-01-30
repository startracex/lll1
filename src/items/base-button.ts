import { createScope, define } from "../root.js";
import { css, html, property, query, unsafeCSS } from "../deps.js";
import { htmlSlot, type HTMLTemplate } from "../lib/templates.js";
import { constructCSS } from "../lib/utils.js";
import ItemsSTD from "./std.js";

const defineName = "base-button";
const cssvarScope = createScope(defineName);

const vars = ["--color", "--background", "--box-shadow", "--ghost-color"];
const colors = {
  black: ["#fff", "linear-gradient(45deg, rgb(41 40 40), #2d3034)", "-2px 2px 5px 0px rgb(0 0 0 / 20%), 2px -2px 5px 0 rgb(99 99 99 / 20%)", "rgb(0 0 0 / 80%)"],
  white: ["#000", "linear-gradient(45deg, rgb(240 240 240 / 85%), rgb(240 240 240 / 70%))", "-2px 2px 5px 0px rgb(255 255 255 / 20%), 2px -2px 5px 0 rgb(165 165 165 / 20%)", "rgb(255 255 255 / 80%)"],
  red: ["#fff", "linear-gradient(45deg, rgb(207 19 34 / 85%), rgb(250 84 28 / 65%))", "-2px 2px 5px 0px rgb(181 35 44 / 20%), 2px -2px 5px 0 rgb(234 130 174 / 20%)", "rgb(214 11 23 / 80%)"],
  green: ["#fff", "linear-gradient(45deg, rgb(25 149 56 / 85%), rgb(0 245 36 / 65%))", "-2px 2px 5px 0px rgb(63 179 69 / 20%), 2px -2px 5px 0 rgb(136 225 142 / 20%)", "rgb(60 214 68 / 80%)"],
  blue: ["#fff", "linear-gradient(45deg, rgb(22 119 255 / 85%), rgb(21 198 198 / 65%))", "-2px 2px 5px 0px rgb(92 182 255 / 20%), 2px -2px 5px 0 rgb(135 232 222 / 20%)", "rgb(42 141 221 / 80%)"],
  yellow: ["#fff", "linear-gradient(45deg, rgb(223 194 0 / 85%), rgb(230 255 0 / 65%))", "-2px 2px 5px 0px rgb(214 203 55 / 20%), 2px -2px 5px 0 rgb(202 203 137 / 20%)", "rgb(237 224 43 / 80%)"],
};

@define(defineName)
export class BaseButton extends ItemsSTD {
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) outline = false;
  @property({ type: Boolean, reflect: true }) ghost = false;
  @property({ type: Boolean, reflect: true }) active = false;
  @property({ type: Boolean, reflect: true }) radius = false;
  @property({ reflect: true }) color: "none" | keyof typeof colors = "black";
  @property() text = "";
  static styles = [
    unsafeCSS(
      constructCSS(
        vars,
        colors,
        (raw) => `:host([color="${raw}"])`,
        (k, v) => `${cssvarScope}${k}:${v}`,
      ),
    ),
    css`
      :host {
        ${cssvarScope}--padding-x: .25em;
        ${cssvarScope}--padding-y: .075em;
        ${cssvarScope}--padding: var(${cssvarScope}--padding-y) var(${cssvarScope}--padding-x);
        ${cssvarScope}--ghost-width: .15em;
        ${cssvarScope}--modal-opacity: .15;
        ${cssvarScope}--modal-opacity-end: 0;
        ${cssvarScope}--modal-animation-duration: .8s;
        color: var(${cssvarScope}--color);
        background: var(${cssvarScope}--background);
        box-shadow: var(${cssvarScope}--box-shadow);
        display: inline-flex;
        width: fit-content;
        border-radius: 4px;
        cursor: pointer;
      }

      :host([disabled]) {
        cursor: not-allowed;
      }

      slot {
        pointer-events: none;
        display: flow-root;
      }

      div {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        border-radius: inherit;
      }

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
      }

      b {
        pointer-events: none;
        transform: translate(-50%, -50%);
        position: absolute;
        visibility: hidden;
      }

      :host([active]) i {
        visibility: visible;
        animation-name: i;
        animation-duration: var(${cssvarScope}--modal-animation-duration);
      }

      p {
        padding: var(${cssvarScope}--padding);
        margin: 0;
        user-select: none;
      }

      :host([ghost]) p {
        background-image: var(${cssvarScope}--background);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      }

      :host([ghost]) {
        ${cssvarScope}--modal-opacity: .2;
        background: transparent;
        box-shadow: 0 0 0 var(${cssvarScope}--ghost-width) var(${cssvarScope}--ghost-color);
      }

      :host([ghost]) i {
        background: var(${cssvarScope}--ghost-color);
      }

      @keyframes i {
        0% {
          transform: scale(0);
          opacity: var(${cssvarScope}--modal-opacity);
        }
        100% {
          transform: scale(1);
          opacity: var(${cssvarScope}--modal-opacity-end);
        }
      }

      :host([outline]) {
        ${cssvarScope}--modal-opacity-end:var( ${cssvarScope}--modal-opacity);
      }

      :host([outline][active]) {
        outline: var(--godown--base-button--ghost-color) var(${cssvarScope}--ghost-width) solid;
      }

      :host([radius]) {
        border-radius: calc(infinity * 1px);
        ${cssvarScope}--padding-x: .5em;
      }
    `,
  ];
  @query("i") _i: HTMLElement;
  @query("b") _b: HTMLElement;
  @query("div") _div: HTMLButtonElement;

  protected render(): HTMLTemplate {
    return html`
      <div>
        <b>
          <i></i>
        </b>
        <p>${this.text || htmlSlot()}</p>
      </div>
    `;
  }

  focus() {
    this.active = true;
  }

  blur() {
    this.active = false;
  }

  protected firstUpdated() {
    if (this.outline) {
      this.addEvent(window, "click", this._handleClick.bind(this));
    } else {
      this.addEvent(this, "mouseup", this.blur);
    }
    this.addEvent(this, "click", this._handleClick);
  }

  protected _handleModal(e: MouseEvent) {
    if (this.disabled) {
      return;
    }
    this.blur();
    const a = this._div.offsetHeight + 1;
    const b = this._div.offsetWidth + 1;
    const size = `${Math.sqrt(a * a + b * b) * 2}px`;
    const translate = `translate(calc(-50% + ${e.offsetX}px), calc(-50% + ${e.offsetY}px))`;
    this._b.style.width = size;
    this._b.style.height = size;
    this._b.style.transform = translate;
    this.focus();
  }

  protected _handleClick(e: MouseEvent) {
    if (e.target === this) {
      this._handleModal(e);
    } else {
      this.blur();
    }
  }
}

export default BaseButton;

declare global {
  interface HTMLElementTagNameMap {
    "base-button": BaseButton;
  }
}
