import { constructCSS, css, cssvar, define, html, property, query, unsafeCSS } from "../deps.js";
import { htmlSlot } from "../tmpl.js";
import ItemsSTD from "./std.js";

const vars = ["--color", "--gradient", "--box-shadow", "--ghost-color"];
const colors = {
  black: ["#fff", "linear-gradient(45deg, rgb(41 40 40), #2d3034)", "-2px 2px 5px 0px rgb(0 0 0 / 20%), 2px -2px 5px 0 rgb(99 99 99 / 20%)", "rgb(0 0 0 / 80%)"],
  white: ["#000", "linear-gradient(45deg, rgb(240 240 240 / 85%), rgb(240 240 240 / 70%))", "-2px 2px 5px 0px rgb(255 255 255 / 20%), 2px -2px 5px 0 rgb(165 165 165 / 20%)", "rgb(255 255 255 / 80%)"],
  red: ["#fff", "linear-gradient(45deg, rgb(207 19 34 / 85%), rgb(250 84 28 / 65%))", "-2px 2px 5px 0px rgb(181 35 44 / 20%), 2px -2px 5px 0 rgb(234 130 174 / 20%)", "rgb(181 35 44 / 80%)"],
  green: ["#fff", "linear-gradient(45deg, rgb(25 149 56 / 85%), rgb(0 245 36 / 65%))", "-2px 2px 5px 0px rgb(63 179 69 / 20%), 2px -2px 5px 0 rgb(136 225 142 / 20%)", "rgb(63 179 69 / 80%)"],
  blue: ["#fff", "linear-gradient(45deg, rgb(22 119 255 / 85%), rgb(21 198 198 / 65%))", "-2px 2px 5px 0px rgb(92 182 255 / 20%), 2px -2px 5px 0 rgb(135 232 222 / 20%)", "rgb(42 141 221 / 80%)"],
  yellow: ["#fff", "linear-gradient(45deg, rgb(247 184 37 / 85%), rgb(220 200 26 / 65%))", "-2px 2px 5px 0px rgb(214 203 55 / 20%), 2px -2px 5px 0 rgb(202 203 137 / 20%)", "rgb(214 203 55 / 80%)"],
};

const outlineBoxShadow = `0 0 0 var(${cssvar}--ghost-width) var(${cssvar}--ghost-color);`;

@define("base-button")
export class BaseButton extends ItemsSTD {
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) outline = false;
  @property({ type: Boolean, reflect: true }) ghost = false;
  @property({ type: Boolean, reflect: true }) active = false;
  @property({ reflect: true }) color: "none" | keyof typeof colors = "black";
  @property() text = "";
  static styles = [
    unsafeCSS(
      constructCSS(
        vars,
        colors,
        (raw) => `:host([color="${raw}"])`,
        (k, v) => `${cssvar}${k}:${v}`,
      ),
    ),
    css`
      :host {
        ${cssvar}--ghost-width: 4px;
        ${cssvar}--modal-opacity: .15;
        ${cssvar}--modal-animation-duration: .5s;
        color: var(${cssvar}--color);
        background: var(${cssvar}--gradient);
        box-shadow: var(${cssvar}--box-shadow);
        display: inline-flex;
        width: fit-content;
        margin: auto;
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
        opacity: var(${cssvar}--modal-opacity);
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
        animation-duration: var(${cssvar}--modal-animation-duration);
      }

      p {
        margin: 0;
      }

      :host([ghost]) p {
        background-image: var(${cssvar}--gradient);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      }

      :host([ghost]) {
        ${cssvar}--modal-opacity: .2;
        background: transparent;
        box-shadow: ${unsafeCSS(outlineBoxShadow)};
      }

      :host([ghost]) i {
        background: var(${cssvar}--ghost-color);
      }

      @keyframes i {
        0% {
          transform: scale(0);
        }
        100% {
          transform: scale(1);
        }
      }
    `,
  ];
  @query("i") _i: HTMLElement;
  @query("b") _b: HTMLElement;
  @query("div") _div: HTMLButtonElement;

  render() {
    return html`
      <div ?disabled="${this.disabled}">
        <b>
          <i></i>
        </b>
        <p>${this.text}${htmlSlot()}</p>
        ${this.outline
          ? html` <style>
              :host([active]) {
                box-shadow: ${outlineBoxShadow};
              }
            </style>`
          : ""}
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
    const padding = getComputedStyle(this).padding;
    if (padding) {
      this._slot.style.padding = padding;
      this.style.padding = "0px";
    }
    if (this.outline) {
      this.addEvent(this, "mousedown", this._handleClick);
      this.addEvent(window, "click", this._handleClick.bind(this));
    } else {
      this.addEvent(this, "mousedown", this._handleModal);
      this.addEvent(this, "mouseup", this.blur);
      this.addEvent(this, "mouseleave", this.blur);
    }
  }

  protected _handleModal(e: MouseEvent) {
    if (this.disabled) return;
    this.blur();
    const size = `${Math.max(this._div.offsetHeight, this._div.offsetWidth) * 2.8285}px`;
    const translate = `translate(calc(-50% + ${e.offsetX}px), calc(-50% + ${e.offsetY}px))`;
    this._b.style.width = size;
    this._b.style.height = size;
    this._b.style.transform = translate;
    this.focus();
  }

  protected _handleClick(e: MouseEvent) {
    if (e.target == this) {
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
