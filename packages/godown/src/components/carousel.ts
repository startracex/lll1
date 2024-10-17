import { godown } from "@godown/element/decorators/godown.js";
import { part } from "@godown/element/decorators/part.js";
import { styles } from "@godown/element/decorators/styles.js";
import { htmlSlot } from "@godown/element/directives/html-slot.js";
import { htmlStyle } from "@godown/element/directives/html-style.js";
import iconChevronLeft from "@godown/f7-icon/icons/chevron-left.js";
import iconChevronRight from "@godown/f7-icon/icons/chevron-right.js";
import { css, html } from "lit";
import { property } from "lit/decorators.js";

import { GlobalStyle } from "../core/global-style.js";

const protoName = "carousel";

/**
 * {@linkcode Carousel} make the content display as a carousel.
 *
 * When this component is `firstUpdated`,
 * clone the first and last element and make the matching element visible when switching index.
 *
 * Child elements should maintain the same size.
 *
 * If no width, it will be the width of the first element.
 *
 * @category display
 */
@godown(protoName)
@styles(
  css`
    :host {
      display: block;
      transition: .3s;
    }

    [part="root"] {
      overflow: hidden;
    }

    [part="root"],
    [part="move-root"] {
      width: 100%;
      display: flex;
      position: relative;
      transition: inherit;
    }

    [part="prev"],
    [part="next"] {
      height: 100%;
      width: 1.5em;
      z-index: 1;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
    }

    [part="prev"] {
      left: 0;
    }

    [part="next"] {
      right: 0;
    }

    slot::slotted(*) {
      flex-shrink: 0 !important;
    }
  `,
)
class Carousel extends GlobalStyle {
  /**
   * The index of the element is displayed for the first time.
   */
  @property({ type: Number })
  index = 0;
  /**
   * If autoChange > 0, the rotation will be automated.
   */
  @property({ type: Number })
  autoChange = 0;
  /**
   * Element width.
   */
  @property()
  width: string;

  @part("move-root")
  _moveRoot: HTMLElement;

  intervalID: number;

  _cloneFirst: HTMLElement | undefined;

  _cloneLast: HTMLElement | undefined;

  protected render() {
    return [
      html`<div part="root">
        <i part="prev" @click="${this.prev}">${iconChevronLeft()}</i>
        <div part="move-root" style="transform:${`translateX(-${this.index + 1}00%)`}">${htmlSlot()}</div>
        <i part="next" @click="${this.next}">${iconChevronRight()}</i>
    </div>`,
      htmlStyle(`:host{width:${this.width};}`),
    ];
  }

  protected async firstUpdated() {
    await this.updateComplete;

    if (this.children.length) {
      this.width ||= `${(this.firstElementChild as HTMLElement).offsetWidth}px`;

      this._cloneFirst?.remove();
      this._cloneLast?.remove();
      this._cloneLast = this.firstElementChild.cloneNode(true) as HTMLElement;
      this._cloneFirst = this.lastElementChild.cloneNode(true) as HTMLElement;
      this.appendChild(this._cloneLast);
      this.insertBefore(this._cloneFirst, this.firstElementChild);
      this.show(this.index);
    }
    if (this.autoChange) {
      this.intervalID = window.setInterval(() => {
        this.next();
      }, this.autoChange);
    }
  }

  disconnectedCallback() {
    clearInterval(this.intervalID);
  }

  show(i: number) {
    this.index = i;
  }

  next() {
    if (this.index === this.childElementCount - 3) {
      this._doTranslateX("0", true);
      this.show(0);
    } else {
      this.show(this.index + 1);
    }
  }

  prev() {
    if (this.index === 0) {
      this._doTranslateX(`-${this.childElementCount - 1}00%`, true);
      this.show(this.children.length - 3);
    } else {
      this.show(this.index - 1);
    }
  }

  protected _doTranslateX(xValue: string, noTransition?: boolean) {
    this._moveRoot.style.transform = `translateX(${xValue})`;
    if (noTransition) {
      this._moveRoot.style.transition = `none`;
    }
    this._moveRoot.getBoundingClientRect();
  }
}

export default Carousel;
