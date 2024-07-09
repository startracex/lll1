import { css, html, property } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import styles from "../../decorators/styles.js";
import { htmlSlot } from "../../lib/directives.js";
import { ListenerFunc } from "../../lib/event-coll.js";
import { GodownElement } from "../../proto/godown-element.js";

const protoName = "dragbox";

/**
 * {@linkcode Dragbox} does not extend beyond the range of {@linkcode Dragbox.offsetsWidth} and {@linkcode Dragbox.offsetsHeight}.
 */
@godown(protoName)
@styles([
  css`
    :host {
      position: absolute;
      display: block;
    }

    :host(:active) {
      -webkit-user-select: none;
      user-select: none;
    }
  `,
])
export class Dragbox extends GodownElement {
  drag: boolean;
  t: number;
  l: number;
  cx: number;
  cy: number;

  /**
   * Position x.
   */
  @property() x = "auto";
  /**
   * Position y.
   */
  @property() y = "auto";

  protected render() {
    return html`<div @mousedown="${this._handleDragStart}" @mouseup="${this._handleDragEnd}">${htmlSlot()}</div>`;
  }

  protected firstUpdated() {
    this.reset();
  }

  protected _handleDragStart(e: MouseEvent) {
    this.cx = e.clientX;
    this.cy = e.clientY;
    this.t = this.offsetTop;
    this.l = this.offsetLeft;
    this.drag = true;
    this.mouseMoveEvent = this.addEvent(document, "mousemove", this._handleDrag.bind(this));
    this.mouseLeaveEvent = this.addEvent(document, "mouseleave", this._handleDragEnd.bind(this));
  }

  mouseMoveEvent: ListenerFunc;
  mouseLeaveEvent: ListenerFunc;

  protected _handleDragEnd() {
    this.drag = false;
    this.removeEvent(document, "mousemove", this.mouseMoveEvent);
    this.removeEvent(document, "mouseleave", this.mouseLeaveEvent);
  }

  protected _handleDrag(e: MouseEvent) {
    if (!this.drag) {
      return;
    }
    const nl = e.clientX - (this.cx - this.l);
    const nt = e.clientY - (this.cy - this.t);
    const { style, offsetsWidth, offsetsHeight, offsetWidth, offsetHeight } = this;
    if (nl < 0) {
      style.left = "0";
    } else if (nl < offsetsWidth - offsetWidth) {
      style.left = `${nl}px`;
    } else {
      style.left = `${offsetsWidth - offsetWidth}"px"`;
    }
    if (nt < 0) {
      style.top = "0";
    } else if (nt < offsetsHeight - offsetHeight) {
      style.top = `${nt}px`;
    } else {
      style.top = `${offsetsHeight - offsetHeight}px`;
    }
  }

  reset() {
    const { x, y, style, offsetsWidth, offsetsHeight, offsetWidth, offsetHeight, offsetLeft, offsetTop } = this;
    style.left = x || "0";
    style.top = y || "0";
    if (offsetLeft > offsetsWidth - offsetWidth) {
      style.left = `${offsetsWidth - offsetWidth}px`;
    }
    if (offsetTop > offsetsHeight - offsetHeight) {
      style.top = `${offsetsHeight - offsetHeight}px`;
    }
  }
}

export default Dragbox;
