import { css, html, property, query } from "../../deps.js";
import { htmlSlot, htmlStyle, type HTMLTemplate } from "../../lib/templates.js";
import { debounce } from "../../lib/utils.js";
import { define } from "../../root.js";
import { GodownElement } from "../../root.js";

const defineName = "scroll-x";

/**
 * ScrollX changes the scroll direction to horizontal.
 */
@define(defineName)
export class ScrollX extends GodownElement {
  /**
   * Element height.
   */
  @property() height = "";

  @query("section") _section: HTMLElement;

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    section {
      overflow: auto;
      position: relative;
      transform-origin: 0 0;
      transform: rotate(-90deg) translateX(-100%);
    }

    section::-webkit-scrollbar {
      display: none;
    }

    span {
      display: flex;
    }

    main {
      width: auto;
      position: absolute;
      left: 100%;
      transform-origin: 0 0;
      transform: rotate(90deg);
    }
  `;

  protected render(): HTMLTemplate {
    const style = this.height && `:host{height:${this.height}}`;
    return html`<section @scroll="${this._handelScroll}">
      <main>
        <span>${htmlSlot()}</span>
      </main>
      ${htmlStyle(style)}
    </section>`;
  }

  protected _handelScroll(e: any) {
    this.dispatchEvent(new CustomEvent("scroll", { detail: e.target.scrollTop }));
  }

  protected firstUpdated() {
    this.resize();
    this.addEvent(window, "resize", debounce(this._handelResize.bind(this), 500));
  }

  protected _handelResize() {
    this.resize();
  }

  resize() {
    const child = this.firstElementChild;
    if (!child) {
      return;
    }
    const height = child.clientHeight || 0;
    if (height) {
      this._section.style.width = height + "px";
      this._section.style.height = getComputedStyle(this).width;
    } else {
      const ComputedHeight = getComputedStyle(child).height;
      this.style.height = ComputedHeight;
      this._section.style.width = ComputedHeight;
      this._section.style.height = getComputedStyle(this).width;
    }
    this.height = this._section.style.width;
  }
}

export default ScrollX;

declare global {
  interface HTMLElementTagNameMap {
    "scroll-x": ScrollX;
  }
}
