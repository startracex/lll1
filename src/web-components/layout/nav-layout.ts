import { css, type CSSResultGroup, html } from "../../.deps.js";
import { define } from "../../decorators/define.js";
import { htmlSlot, type HTMLTemplate } from "../../lib/templates.js";
import { createScope, cssvarValues, GodownElement } from "../../supers/root.js";

const defineName = "nav-layout";
const cssvarScope = createScope(defineName);

/**
 * {@linkcode NavLayout} renders a navigation, an optional top header, an optional bottom footer.
 *
 * @slot - The main content of the layout.
 *
 * @slot nav - The navigation of the layout.
 *
 * @slot header - The header of the layout.
 *
 * @slot footer - The footer of the layout.
 */
@define(defineName)
export class NavLayout extends GodownElement {
  /**
   * @deprecated
   */
  host: string;
  /**
   * @deprecated
   */
  subhead: string;
  /**
   * @deprecated
   */
  set: 0 | 1 | 2;

  static styles = [
    GodownElement.styles,
    css`
      :host {
        ${cssvarScope}--text: var(${cssvarValues.text});
        ${cssvarScope}--background: var(${cssvarValues.main});
        ${cssvarScope}--nav-height: 2.4em;
        ${cssvarScope}--title-font-size: 1.4em;
        ${cssvarScope}--nav-padding: 0 2.5%;
        ${cssvarScope}--main-flex: 1;
        ${cssvarScope}--main-padding: 0;
        width: 100%;
        height: 100%;
        display: flex !important;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        min-height: 100%;
        color: var(${cssvarScope}--text);
      }

      nav {
        color: var(${cssvarScope}--text);
        background: var(${cssvarScope}--background);
        padding: var(${cssvarScope}--nav-padding);
        height: var(${cssvarScope}--nav-height);
        width: 100%;
        position: relative;
      }

      main {
        position: relative;
        flex: 1;
        width: 100%;
      }
    `,
  ] as CSSResultGroup;

  protected render(): HTMLTemplate {
    return html`${htmlSlot("header")}
      <nav>${htmlSlot("nav")}</nav>
      <main>${htmlSlot()}</main>
      ${htmlSlot("footer")}`;
  }
}

export default NavLayout;

declare global {
  interface HTMLElementTagNameMap {
    "nav-layout": NavLayout;
    "g-nav-layout": NavLayout;
  }
}
