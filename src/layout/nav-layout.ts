import { html, css, property, define, cssvar } from "../deps.js";
import "../view/down-drop.js";
import STD, { navstyle } from "./std.js";
@define("nav-layout")
export class NavLayout extends STD {
  static styles = [
    STD.styles,
    css`
      :host {
        ${navstyle}
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
  ];
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
          ${this.opt()}
          <slot name="opt"></slot>
        </div>
      </nav>
      <main><slot></slot></main>
      <slot name="footer"></slot>`;
  }
  opt() {
    const result = [];
    for (let i = 0; i <= this.set - 1; i++) {
      opts[i] && result.unshift(opts[i]);
    }
    return result;
  }
}
const opts = [
  html`<down-drop
    ><a slot="hover"
      ><svg viewBox="0 0 1024 1024" width="1.8em" height="1.8em"><path fill="currentColor" d="M588.8 128l12 83.2 4.8 34.4 31.2 14.4c12.8 6.4 26.4 13.6 38.4 21.6l28 18.4 31.2-12 81.6-32 76 127.2-67.2 51.2-28 21.6 3.2 35.2c0.8 7.2 0.8 14.4 0.8 20.8s0 13.6-0.8 20.8l-3.2 35.2 28 21.6 67.2 51.2-75.2 127.2-82.4-32-31.2-12-28 18.4c-12.8 8.8-25.6 16-38.4 21.6l-31.2 14.4-4.8 33.6-12 84H435.2l-12-83.2-4.8-34.4-31.2-14.4c-12.8-6.4-26.4-13.6-38.4-21.6l-28-18.4-31.2 12L208 768l-76-127.2 67.2-51.2 28-21.6-3.2-35.2c-0.8-7.2-0.8-14.4-0.8-20.8s0-13.6 0.8-20.8l3.2-35.2-28-21.6-67.2-51.2L207.2 256l82.4 32 31.2 12 28-18.4c12.8-8.8 25.6-16 38.4-21.6l31.2-14.4 4.8-33.6L435.2 128h153.6m8.8-64H426.4c-27.2 0-49.6 19.2-53.6 44.8L360 201.6c-16 7.2-31.2 16-47.2 26.4l-90.4-35.2c-6.4-2.4-12.8-3.2-19.2-3.2-19.2 0-37.6 9.6-46.4 26.4L71.2 360c-13.6 22.4-8 52 12.8 68l76 57.6c-0.8 9.6-1.6 18.4-1.6 26.4s0 16.8 1.6 26.4l-76 57.6c-20.8 16-26.4 44-12.8 68l84.8 143.2c9.6 16.8 28 27.2 47.2 27.2 6.4 0 12-0.8 18.4-3.2L312 796c15.2 10.4 31.2 19.2 47.2 26.4l13.6 92c3.2 25.6 26.4 45.6 53.6 45.6h171.2c27.2 0 49.6-19.2 53.6-44.8l13.6-92.8c16-7.2 31.2-16 47.2-26.4l90.4 35.2c6.4 2.4 12.8 3.2 19.2 3.2 19.2 0 37.6-9.6 46.4-26.4l85.6-144.8c12.8-23.2 7.2-51.2-13.6-67.2l-76-57.6c0.8-8 1.6-16.8 1.6-26.4 0-9.6-0.8-18.4-1.6-26.4l76-57.6c20.8-16 26.4-44 12.8-68l-84.8-143.2c-9.6-16.8-28-27.2-47.2-27.2-6.4 0-12 0.8-18.4 3.2L712 228c-15.2-10.4-31.2-19.2-47.2-26.4l-13.6-92c-4-26.4-26.4-45.6-53.6-45.6zM512 384c70.4 0 128 57.6 128 128s-57.6 128-128 128-128-57.6-128-128 57.6-128 128-128m0-64c-105.6 0-192 86.4-192 192s86.4 192 192 192 192-86.4 192-192-86.4-192-192-192z"></path></svg
    ></a>
    <div class="option"><a href="/zh">简体中文</a><a href="/en">English</a><a href="/ru">Русский</a></div></down-drop
  >`,
  html`<down-drop
    ><a href="/account" slot="hover"
      ><svg viewBox="0 0 1024 1024" width="1.8em" height="1.8em"><path fill="currentColor" d="M870.314 877.39C777.938 967.975 651.552 1024 512 1024 229.24 1024 0.018 794.742 0.018 511.981 0.018 229.221 229.24 0 512 0s511.982 229.222 511.982 511.982c0 143.21-58.914 272.485-153.668 365.41zM512 950.86c103.932 0 199.307-36.314 274.496-96.728C746.45 740.398 639.447 658.262 512 658.262c-127.447 0-234.451 82.136-274.496 195.87C312.693 914.546 408.068 950.86 512 950.86z m0-877.684c-242.35 0-438.842 196.492-438.842 438.842 0 109.528 40.374 209.4 106.712 286.308C237.724 672.597 364.513 585.158 512 585.158c147.45 0 274.276 87.44 332.13 213.168 66.338-76.87 106.712-176.78 106.712-286.308 0-242.35-196.492-438.842-438.842-438.842z m0 475.412c-101.007 0-182.85-81.88-182.85-182.85 0-101.007 81.843-182.851 182.85-182.851 100.97 0 182.85 81.844 182.85 182.85 0 100.97-81.88 182.851-182.85 182.851z m0-292.561c-60.597 0-109.71 49.114-109.71 109.674 0 60.596 49.113 109.71 109.71 109.71 60.597 0 109.71-49.114 109.71-109.71 0-60.56-49.113-109.674-109.71-109.674z"></path></svg></a
  ></down-drop>`,
];
export default NavLayout;
declare global {
  interface HTMLElementTagNameMap {
    "nav-layout": NavLayout;
  }
}
