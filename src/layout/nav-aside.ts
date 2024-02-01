import { createScope, cssvarValues, define } from "../root.js";
import { css, type CSSResultGroup, html, property } from "../deps.js";
import { htmlSlot, htmlStyle, type HTMLTemplate } from "../lib/templates.js";
import LayoutSTD from "./std.js";

const defineName = "nav-aside";
const cssvarScope = createScope(defineName);

/**
 * NavAside renders a side or top navigation.
 */
@define(defineName)
export class NavAside extends LayoutSTD {
  /**
   * The width of the screen for the position change.
   */
  @property() mobile = "720px";
  /**
   * The position behavior.
   */
  @property() position = "sticky fixed";

  static styles = [
    LayoutSTD.styles,
    css`
      :host {
        ${cssvarScope}--text: var(${cssvarValues.text});
        ${cssvarScope}--background: var(${cssvarValues.main});
        color: var(${cssvarScope}--text);
        background: var(${cssvarScope}--background);
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
  ] as CSSResultGroup;

  protected render(): HTMLTemplate {
    const position = this.position.split(/\s+/);
    const p = position[0] || "sticky";
    const pm = position[1] || "fixed";
    const m = this.mobile || "720px";
    const style = `:host{position:${p} !important;}@media(min-width:${m}){:host{position:${pm} !important;width:fit-content !important;height:100% !important;}nav{display: flex !important;justify-content: space-between !important;flex-direction: column !important;align-content: flex-start !important;align-items: stretch !important;}}`;
    return html`<nav>${htmlSlot()}</nav>
      ${htmlStyle(style)}`;
  }
}

export default NavAside;
declare global {
  interface HTMLElementTagNameMap {
    "nav-aside": NavAside;
  }
}
