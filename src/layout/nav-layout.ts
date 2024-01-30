import { createScope, cssvarValues, define } from "../root.js";
import { css, type CSSResultGroup, html, property } from "../deps.js";
import { htmlSlot, type HTMLTemplate } from "../lib/templates.js";
import LayoutSTD from "./std.js";

const defineName = "nav-layout";
const cssvarScope = createScope(defineName);

@define(defineName)
export class NavLayout extends LayoutSTD {
  static styles = [
    LayoutSTD.styles,
    css`
      :host {
        ${cssvarScope}--text: var(${cssvarValues.text});
        ${cssvarScope}--background: var(${cssvarValues.main});
        ${cssvarScope}--super-background:var(${cssvarValues.input}--true);
        ${cssvarScope}--height: 2.4em;
        ${cssvarScope}--h1-size: calc(var(${cssvarScope}--height) / 2);
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: center;
        min-height: 100%;
      }

      nav {
        color: var(${cssvarScope}--text);
        background: var(${cssvarScope}--background);
      }

      nav {
        height: var(${cssvarScope}--height);
        min-height: var(${cssvarScope}--height);
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
        font-size: var(${cssvarScope}--h1-size);
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
        position: relative;
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
  ] as CSSResultGroup;
  @property() host = "";
  @property() subhead = "";
  @property({ type: Number }) set: 0 | 1 | 2 = 0;

  protected render(): HTMLTemplate {
    return html` ${htmlSlot("header")} ${this.renderNav()}
      <main>${htmlSlot()}</main>
      ${htmlSlot("footer")}`;
  }

  private renderNav(): HTMLTemplate {
    if (this.querySelector("[slot=nav]")) {
      return htmlSlot("nav");
    }
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
    </nav>`;
  }
}

export default NavLayout;
declare global {
  interface HTMLElementTagNameMap {
    "nav-layout": NavLayout;
  }
}
