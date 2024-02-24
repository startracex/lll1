import { css, CSSResultGroup, html, property, query } from "../../.deps.js";
import { define } from "../../decorators/define.js";
import { htmlSlot, type HTMLTemplate } from "../../lib/templates.js";
import GodownOpenable, { Direction9 } from "../../supers/openable.js";
import { cssvar, cssvarValues } from "../../supers/root.js";

const defineName = "dialog";

/**
 * {@linkcode Dialog} similar to dialog.
 */
@define(defineName)
export class Dialog extends GodownOpenable {
  direction: Direction9 = "center";
  /**
   * Enable modal.
   */
  @property({ type: Boolean, reflect: true }) modal = false;
  /**
   * Enable scale.
   */
  @property({ type: Boolean }) scale = false;
  /**
   * Scale gap.
   */
  @property({ type: Number }) gap = 0.2;
  /**
   * Exit key, which can be multiple.
   */
  @property({ type: String }) key = "Escape";

  @query("div") _div: HTMLDivElement;

  static styles: CSSResultGroup = [
    GodownOpenable.styles,
    css`
      :host {
        display: block;
        transition:
          all 0.3s ease-in-out,
          color 0s,
          background 0s;
        height: fit-content;
      }
    `,
    css`
      :host {
        ${cssvar}--background: rgb(var(${cssvarValues.mainRGB}) / 0%);
        ${cssvar}--background-modal: rgb(var(${cssvarValues.mainRGB}) / 15%);
        position: fixed;
        height: 100%;
        width: 100%;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        transition: all 0.3s;
        display: flex;
        visibility: hidden;
        background: var(${cssvar}--background);
        pointer-events: none;
      }

      :host([open]) {
        visibility: visible;
      }

      :host([open][modal]) {
        pointer-events: all;
        backdrop-filter: blur(0.25px);
        background: var(${cssvar}--background-modal);
      }

      :host([open]) slot {
        opacity: 1 !important;
        transform: translateY(0) translateX(0) !important;
      }

      div {
        height: 100%;
        width: 100%;
        display: flex;
        transition: inherit;
        transform: scale(var(--s));
      }

      slot {
        display: block;
        width: fit-content;
        height: fit-content;
        margin: auto;
        opacity: 0;
        transition: inherit;
        pointer-events: all;
      }

      div {
        position: relative;
      }

      slot {
        position: absolute;
      }

      [class^="top"] slot {
        top: 0;
      }

      [class^="bottom"] slot {
        bottom: 0;
      }

      [class$="right"] slot {
        right: 0%;
      }

      [class$="left"] slot {
        left: 0%;
      }

      div[class$="center"],
      .top,
      .left,
      .right,
      .bottom {
        align-items: center;
        justify-content: center;
        align-items: center;
        justify-content: center;
      }
    `,
  ];

  protected render(): HTMLTemplate {
    return html`<div style="--s:1" class="${this.direction}">${htmlSlot()}</div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEvent(this, "submit", this._handelSubmit);
    if (this.scale && this.direction === "center") {
      this.addEvent(this, "wheel", this._handleWheel);
    }
    if (this.key) {
      this.addEvent(document, "keydown", this._handleKeydown.bind(this));
    }
    if (this.open) {
      this.show();
    }
  }

  showModal() {
    this.modal = true;
    this.show();
  }

  protected _handleWheel(e: any) {
    let scale = Number(this._div.style.getPropertyValue("--s"));
    if (e.deltaY > 0) {
      scale -= this.gap;
    } else {
      scale += this.gap;
    }
    this._div.style.setProperty("--s", `${scale}`);
  }

  protected _handleKeydown(e: KeyboardEvent) {
    const keys = this.key.split(/[^a-zA-Z0-9]/).filter((s) => s);
    if (keys.includes(e.key) || keys.includes(e.code)) {
      this.close();
    }
  }

  protected _handelSubmit(e: SubmitEvent) {
    if ((e.target as HTMLFormElement).method === "dialog") {
      this.close();
    }
  }
}

export default Dialog;

declare global {
  interface HTMLElementTagNameMap {
    "open-dialog": Dialog;
    "g-dialog": Dialog;
  }
}
