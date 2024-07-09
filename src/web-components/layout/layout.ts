import { css, html, property } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { combine, htmlSlot, ifValue } from "../../lib/directives.js";
import { GodownElement } from "../../proto/godown-element.js";

const protoName = "layout";
/**
 * {@linkcode NavLayout} renders a navigation, an optional top header, an optional bottom footer.
 *
 * @slot - The main content of the layout.
 *
 * @slot header - The header of the layout.
 *
 * @slot footer - The footer of the layout.
 */
@godown(protoName)
@styles([
  css`
    :host {
      min-height: 100%;
      display: flex;
      flex-direction: column;
    }

    .sticky {
      position: sticky;
      top: 0;
      z-index: 1;
    }

    [part="main"] {
      position: relative;
      flex: 1;
      width: 100%;
    }

    [part] {
      width: 100%;
    }
  `,
])
export class NavLayout extends GodownElement {
  @property({
    type: Boolean,
  })
  noHeader: boolean;
  @property({
    type: Boolean,
  })
  noFooter: boolean;

  @property({
    type: Boolean,
  })
  sticky: boolean;

  protected render() {
    return html`${ifValue(
        !this.noHeader,
        html`<header
          part="header"
          class="${combine({
            sticky: this.sticky,
          })}"
        >
          ${htmlSlot("header")}
        </header>`,
      )}
      <main part="main">${htmlSlot()}</main>
      ${ifValue(!this.noFooter, html`<footer part="footer">${htmlSlot("footer")}</footer> `)}`;
  }
}

export default NavLayout;
