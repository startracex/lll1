import { css, CSSResultGroup, cssvar, define, html, property } from "../deps.js";
import STD, { navstyle } from "./std.js";
@define("nav-layout")
export class NavLayout extends STD {
  static styles = [
    STD.styles,
    navstyle,
    css`
      :host {
        ${cssvar}--nav-height:2.4em;
        ${cssvar}--nav-h1-size:calc(var(${cssvar}--nav-height)/2);
        width: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: center;
        min-height: 100%;
      }
      nav,
      .option {
        color: var(${cssvar}--nav-text);
        background: var(${cssvar}--nav-background);
      }
      .option a:hover {
        background: var(${cssvar}--nav-super-background);
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
      .option {
        overflow: hidden;
      }
      .option a {
        height: 2.4em;
        line-height: 2.4em;
        display: block;
        white-space: nowrap;
        padding: 0 0.9em;
        text-align: center;
        transition: background-color 152ms;
      }
      .option a:hover {
        transform: scale(1.025);
      }
      down-drop a {
        display: flex;
        padding: 0.15em;
        box-sizing: border-box;
        height: 100%;
        justify-content: center;
        align-items: center;
      }
      down-drop a::selection {
        color: var(${cssvar}--text-selection);
        background: var(${cssvar}--text-selection-background);
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
      <main><slot></slot></main>
      <slot name="footer"></slot>`;
  }
}

export default NavLayout;
declare global {
  interface HTMLElementTagNameMap {
    "nav-layout": NavLayout;
  }
}
