import { styles } from "@godown/element/decorators/index.js";
import { htmlSlot } from "@godown/element/directives/html-slot.js";
import { css, html } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { GlobalStyle } from "./global-style.js";

@styles(css`
  :host {
    display: inline-block;
    color: currentColor;
    text-decoration: none;
    cursor: default;
  }

  :host([href]) {
    cursor: pointer;
  }

  a {
    width: 100%;
    display: flex;
    color: inherit;
    text-decoration: inherit;
    justify-content: space-between;
    align-items: center;
  }
`)
class SuperAnchor extends GlobalStyle {
  /**
   * A element href.
   */
  @property()
  href: string = undefined;
  /**
   * A element target.
   */
  @property()
  target: "_blank" | "_self" | "_parent" | "_top" = "_self";

  protected render() {
    return html`<a part="root" href="${ifDefined(this.href)}" target="${this.target}" @click=${this._handleClick}>
      ${htmlSlot()}
    </a>`;
  }

  // eslint-disable-next-line
  protected _handleClick(_: MouseEvent) {}
}

export default SuperAnchor;
