import { css, CSSResultGroup, cssvar, define, html, property } from "../deps.js";
import LayoutSTD, { navStyle } from "./std.js";
import { htmlSlot } from "../tmpl.js";

@define("nav-layout")
export class NavLayout extends LayoutSTD {
  static styles = [
    LayoutSTD.styles,
    navStyle,
    css`
      :host {
        ${cssvar}--nav-height: 2.4em;
        ${cssvar}--nav-h1-size: calc(var(${cssvar}--nav-height) / 2);
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: center;
        min-height: 100%;
      }

      nav {
        color: var(${cssvar}--nav-text);
        background: var(${cssvar}--nav-background);
      }

      nav {
        height: var(${cssvar}--nav-height);
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 0 2.5%;
        box-sizing: border-box;
        margin: auto;
        position: relative;
        z-index: 2;
      }

      a {
        text-decoration: none;
        color: currentColor;
      }

      h1 {
        font-weight: normal;
        font-size: var(${cssvar}--nav-h1-size);
        margin: 0;
        display: flex;
        align-items: center;
      }

      h1 span {
        height: 1em;
        width: 0.1em;
        background: currentColor;
        margin: 0.24em;
      }

      h1 > * {
        white-space: nowrap;
      }

      main {
        flex: 1;
        width: inherit;
        display: flex;
        flex-direction: column;
        z-index: 1;
      }

      nav > div {
        height: 100%;
        display: flex;
        flex-direction: row;
      }

      @media screen and (max-width: 540px) {
        h1 a ~ * {
          display: none;
        }
      }
    `,
  ] as CSSResultGroup[];
  @property() host = "";
  @property() subhead = "";
  @property({ type: Number }) set: 0 | 1 | 2 = 0;

  render() {
    return html`<nav>
        <h1>
          <slot name="host"></slot>
          <a href="/">${this.host}</a>${this.subhead &&
          html`<span></span>
            <div>${this.subhead}</div>`}
        </h1>
        <div>
          <slot name="opt"></slot>
        </div>
      </nav>
      <main>${htmlSlot()}</main>
      <slot name="footer"></slot>`;
  }
}

export default NavLayout;
declare global {
  interface HTMLElementTagNameMap {
    "nav-layout": NavLayout;
  }
}
