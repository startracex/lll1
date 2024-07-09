import { css, html, property } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { htmlSlot } from "../../lib/directives.js";
import GodownSuperOpenable, { type Direction9 } from "../../proto/super-openable.js";
import { createScope, cssGlobalVars } from "../../styles/global.js";

const protoName = "dialog";
const cssScope = createScope(protoName);

/**
 * {@linkcode Dialog} similar to dialog.
 */
@godown(protoName)
@styles([
  css`
    :host {
      --${cssScope}--background: none;
      --${cssScope}--background-modal: rgb(var(--${cssGlobalVars.backgroundRGB}) / 15%);
      background: var(--${cssScope}--background);
      height: 100%;
      width: 100%;
      position: fixed;
      inset:0;
      display: flex;
      visibility: hidden;
      transition: all 0.3s;
      pointer-events: none;
    }

    :host([open]) {
      visibility: visible;
    }

    :host([open][modal]) {
      pointer-events: all;
      background: var(--${cssScope}--background-modal);
    }

    :host([open]) div {
      opacity: 1;
    }

    div {
      height: 100%;
      width: 100%;
      display: flex;
      opacity: 0;
      position: relative;
    }

    slot {
      display: block;
      width: -moz-fit-content;
      width: fit-content;
      height: -moz-fit-content;
      height: fit-content;
      margin: auto;
      transition: inherit;
      pointer-events: all;
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
    }
  `,
])
export class Dialog extends GodownSuperOpenable {
  direction: Direction9 = "center";
  /**
   * Enable modal.
   */
  @property({ type: Boolean, reflect: true }) modal = false;
  /**
   * @deprecated
   */
  scale: boolean;
  /**
   * @deprecated
   */
  gap: number;
  /**
   * Exit key, which can be multiple.
   */
  @property({ type: String }) key = "Escape";

  protected render() {
    return html`<div part="root" class="${this.direction}">${htmlSlot()}</div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEvent(this, "submit", this._handelSubmit);
    if (this.key) {
      this.addEvent(document, "keydown", this._handleKeydown.bind(this));
    }
  }

  showModal() {
    this.modal = true;
    this.show();
  }

  protected _handelWheel(e: WheelEvent) {
    if (this.modal) {
      e.preventDefault();
    }
  }

  protected _handleKeydown(e: KeyboardEvent) {
    const keys = this.key.split(/[\s;]/);
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
