import { css, define, DisableWarning, GlobalSTD, html, property } from "../deps.js";
import { htmlSlot, htmlStyle } from "../tmpl.js";
import { debounce } from "../lib/utils.js";

@define("scroll-x")
export class ScrollX extends GlobalSTD {
  @property() height = "";
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
      height: 500px;
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

  get _section() {
    return this.shadowRoot.querySelector("section");
  }

  render() {
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

  firstUpdated() {
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
    const ClientHeight = child.clientHeight || 0;
    if (ClientHeight) {
      this._section.style.width = ClientHeight + "px";
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

DisableWarning(ScrollX);

export default ScrollX;

declare global {
  interface HTMLElementTagNameMap {
    "scroll-x": ScrollX;
  }
}
