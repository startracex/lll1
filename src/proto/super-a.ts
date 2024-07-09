import { css, html, ifDefined, property } from "../_deps.js";
import { styles } from "../decorators/styles.js";
import { htmlSlot } from "../lib/directives.js";
import { svgArrow, svgDelta, svgLink } from "../lib/icons.js";
import { GodownElement } from "./godown-element.js";

@styles([
  css`
    :host([arrow="delta"]) svg {
      transform: rotate(-90deg);
    }

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

    i {
      display: inline-flex;
      border-radius: 20%;
      font-style: normal;
    }

    i > svg {
      width: 1em;
      height: 1em;
      border-radius: inherit;
    }

    :host(:hover) i {
      animation: arrow 0.3s linear;
    }

    i:hover {
      background-color: rgb(0 0 0 / 0.075);
    }

    @keyframes arrow {
      from {
        transform: translateX(0);
      }
      50% {
        transform: translateX(0.05em);
      }
      to {
        transform: translateX(0);
      }
    }
  `,
])
export class GodownSuperA extends GodownElement {
  /**
   * True when the href is in the same pathname as the location.
   */
  @property({ type: Boolean, reflect: true }) active = false;
  /**
   * Href for a element.
   */
  @property() href: string = undefined;
  /**
   * Target for an element.
   */
  @property() target: "_blank" | "_self" | "_parent" | "_top" = "_self";
  /**
   * Arrow type.
   */
  @property() arrow: "" | "link" | "delta" | "arrow" | "angle" = "";

  protected render() {
    return html`<a part="root" href="${ifDefined(this.href)}" target="${this.target}" @click=${this._handleClick}>
      ${htmlSlot()}
      <i part="arrow">${this._arrowSwitcher()}</i>
    </a>`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  protected _handleClick(_: MouseEvent) {}

  private _arrowSwitcher() {
    switch (this.arrow) {
      case "delta":
        return svgDelta();
      case "arrow":
        return svgArrow(true);
      case "angle":
        return svgArrow();
      case "link":
        return svgLink();
      default:
        return htmlSlot("icon");
    }
  }
  connectedCallback(): void {
    super.connectedCallback();
    this.useActive();
  }

  useActive() {
    const url = new URL(this.href, location.href);
    const sameOrigin = url.origin === location.origin;
    if (sameOrigin) {
      this.active = url.pathname === location.pathname;
    }
    return {
      url,
      sameOrigin,
      active: this.active,
    };
  }
}

export default GodownSuperA;
