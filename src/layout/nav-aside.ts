import { css, CSSResultGroup, cssvar, define, html, property } from "../deps.js";
import STD, { navstyle } from "./std.js";
@define("nav-aside")
export class NavAside extends STD {
  @property() m = "720px";
  @property() position = "sticky fixed";
  static styles = [
    STD.styles,
    navstyle,
    css`
      :host {
        color: var(${cssvar}--nav-text);
        background: var(${cssvar}--nav-background);
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        height: fit-content;
        display: flex;
      }
      nav {
        height: inherit;
        width: inherit;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        box-sizing: border-box;
      }
    `,
  ] as CSSResultGroup[];
  render() {
    const p = this.position.split(" ")[0] || "sticky";
    const pm = this.position.split(" ")[1] || "fixed";
    const m = this.m || "720px";
    const styled = `:host{position:${p} !important;}@media(min-width:${m}){:host{position:${pm} !important;width:fit-content !important;height:100% !important;}nav{display: flex !important;justify-content: space-between !important;flex-direction: column !important;align-content: flex-start !important;align-items: stretch !important;}}`;
    return html`<nav><slot></slot></nav>
      <style>
        ${styled}
      </style>`;
  }
}
export default NavAside;
declare global {
  interface HTMLElementTagNameMap {
    "nav-aside": NavAside;
  }
}
