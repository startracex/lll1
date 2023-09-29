import { css, define, html } from "../deps.js";
import STD from "./std.js";
@define("scroll-x")
export class ScrollX extends STD {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: fit-content;
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
    return html`<section>
      <main>
        <span><slot></slot></span>
      </main>
    </section>`;
  }
  firstUpdated() {
    this._section.addEventListener("scroll", (e: any) => {
      this.dispatchEvent(new CustomEvent("scroll", { detail: e.target.scrollTop }));
    });
    this.resize();
    window.addEventListener("resize", () => {
      this.resize();
    });
  }
  resize() {
    const child = this.firstElementChild;
    if (!child) return;
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
  }
}
export default ScrollX;
declare global {
  interface HTMLElementTagNameMap {
    "scroll-x": ScrollX;
  }
}
