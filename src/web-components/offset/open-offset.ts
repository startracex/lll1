import { css, type CSSResultGroup, html, query } from "../../.deps.js";
import { define } from "../../decorators/define.js";
import { htmlSlot, type HTMLTemplate } from "../../lib/templates.js";
import { debounce } from "../../lib/utils.js";
import { type Direction4, GodownOpenable } from "../../supers/openable.js";

const defineName = "open-offset";

/**
 * {@linkcode OpenOffset} will calculate a lateral offset to try to keep the content within the allowable range.
 *
 * Content can be opened in 4 directions.
 */
@define(defineName)
export class OpenOffset extends GodownOpenable {
  direction: Direction4;

  @query("aside") private _balancer: HTMLElement;

  static styles = [
    css`
      :host {
        display: block;
        height: fit-content;
        width: fit-content;
      }

      span {
        user-select: none;
      }

      main {
        height: inherit;
        width: inherit;
        display: flex;
        position: relative;
        align-items: center;
      }

      aside {
        background-color: inherit;
        visibility: hidden;
        top: 100%;
        z-index: 1;
      }

      :host([open]) aside {
        visibility: visible;
      }

      :host([float]) aside {
        position: absolute;
      }
    `,
    css`
      .left {
        flex-direction: row-reverse;
      }
      .right {
        flex-direction: row;
      }
      .top {
        flex-direction: column-reverse;
      }
      .bottom {
        flex-direction: column;
      }
    `,
  ] as CSSResultGroup;

  protected render(): HTMLTemplate {
    return html`<main class="${this.direction || "bottom"}">
      <span>${this.summary || htmlSlot("summary")}</span>
      <aside>${htmlSlot()}</aside>
    </main>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEvent(window, "resize", debounce(this._handelResize.bind(this), 500));
  }

  protected async firstUpdated() {
    await this.updateComplete;
    this.addEvent(document, "click", this._handelClick.bind(this));
    this.resize();
  }

  protected _handelClick(e: MouseEvent) {
    if (e.target === this) {
      this.show();
    } else if (!this.contains(e.target as HTMLElement)) {
      this.close();
    }
  }

  protected _handelResize() {
    this._balancer.style.transform = "none";
    this.resize();
  }

  resize() {
    if (!this._balancer) {
      return;
    }
    const offsets = this.offsetParent?.getBoundingClientRect() || document.body.getBoundingClientRect();
    const { left, right, top, bottom, height } = this._balancer.getBoundingClientRect();
    if (this.direction === "left" || this.direction === "right") {
      if (top < offsets.y) {
        const topTranslate = -top;
        this._balancer.style.transform = `translateY(${topTranslate}px)`;
      }
      if (bottom > offsets.bottom) {
        const bottomTranslate = offsets.height - (top + height);
        this._balancer.style.transform = `translateY(${bottomTranslate}px)`;
      }
    } else {
      if (right > offsets.right) {
        const rightTranslate = offsets.width - (right - offsets.x);
        this._balancer.style.transform = `translateX(${rightTranslate}px)`;
      } else if (left < 0) {
        const leftTranslate = -left;
        this._balancer.style.transform = `translateX(${leftTranslate}px)`;
      } else {
        this._balancer.style.transform = "";
      }
    }
  }
}

export default OpenOffset;

declare global {
  interface HTMLElementTagNameMap {
    "open-offset": OpenOffset;
    "g-open-offset": OpenOffset;
  }
}
