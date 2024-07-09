import { css, html, property } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { part } from "../../decorators/part.js";
import { styles } from "../../decorators/styles.js";
import { htmlSlot } from "../../lib/directives.js";
import { htmlStyle } from "../../lib/directives.js";
import { svgArrow } from "../../lib/icons.js";
import { GodownElement } from "../../proto/godown-element.js";

const protoName = "carousel";

/**
 * {@linkcode Carousel} rotates child elements.
 */
@godown(protoName)
@styles([
  css`
    :host {
      display: block;
      transition: all 0.2s;
    }

    [part="root"] {
      overflow: hidden;
    }

    div {
      width: 100%;
      display: flex;
      position: relative;
      transition: inherit;
    }

    a {
      position: absolute;
      height: 100%;
      width: -moz-fit-content;
      width: fit-content;
      z-index: 1;
      display: flex;
      align-items: center;
    }

    [part="prev"] {
      left: 0;
    }

    [part="prev"] svg {
      transform: rotate(180deg);
    }

    [part="next"] {
      right: 0;
    }

    i {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.3s;
      width: 2em;
      height: 100%;
    }

    svg {
      flex: 1;
      max-height: 100%;
      max-width: 100%;
    }

    a:hover i {
      background-color: #0000001a;
      width: 2.2em;
    }

    i svg path {
      stroke-width: 4;
    }

    slot::slotted(*) {
      flex-shrink: 0 !important;
    }
  `,
])
export class Carousel extends GodownElement {
  /**
   * The index of the element is displayed for the first time.
   */
  @property({ type: Number }) index = 0;
  /**
   * If autoChange > 0, the rotation will be automated.
   */
  @property({ type: Number }) autoChange = 0;
  /**
   * Width.
   */
  @property() width = "";

  @part("move-root") _moveRoot: HTMLElement;
  intervalID: number;
  _clone: HTMLElement[] = [];

  protected render() {
    const style = this.width && `:host{width:${this.width.split(";")[0]};}`;
    return html`<div part="root">
      <a part="prev" class="prev" @click="${this.prev}">
        <i>${svgArrow()}</i>
      </a>
      <div part="move-root">${htmlSlot()}</div>
      <a part="next" class="next" @click="${this.next}">
        <i>${svgArrow()}</i>
      </a>
      ${htmlStyle(style)}
    </div>`;
  }

  protected firstUpdated() {
    if (this.assigned.length) {
      if (!this.width) {
        this.width = `${this.assigned[0].offsetWidth}px`;
      }
      if (this._clone.length) {
        this._clone.forEach((element) => element.remove());
        this._clone = [];
      }
      const last = this.assigned[0].cloneNode(true) as HTMLElement;
      const first = this.assigned[this.assigned.length - 1].cloneNode(true) as HTMLElement;
      first.style.marginLeft = "-100%";
      this._clone.push(first, last);
      this.appendChild(last);
      this.insertBefore(first, this.firstElementChild);
      this.show(this.index);
    }
    if (this.autoChange) {
      this.intervalID = setInterval(() => {
        this.next();
      }, this.autoChange);
    }
  }

  disconnectedCallback() {
    clearInterval(this.intervalID);
  }

  show(i: number) {
    this.index = i;
    this._moveRoot.style.transform = `translateX(-${i}00%)`;
    this._moveRoot.style.transition = "inherit";
  }

  next() {
    if (this.index === this.assigned.length - 3) {
      this._moveRoot.style.transform = `translateX(100%)`;
      this._moveRoot.style.transition = "none";
      this._moveRoot.getBoundingClientRect();
      this.show(0);
    } else {
      this.show(this.index + 1);
    }
  }

  prev() {
    if (this.index === 0) {
      this._moveRoot.style.transform = `translateX(-${this.assigned.length - 2}00%)`;
      this._moveRoot.style.transition = `none`;
      this._moveRoot.getBoundingClientRect();
      this.show(this.assigned.length - 3);
    } else {
      this.show(this.index - 1);
    }
  }
}

export default Carousel;
