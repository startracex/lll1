import { css, html, ifDefined, property } from "../.deps.js";
import { htmlSlot, type HTMLTemplate, svgArrow, svgDelta } from "../lib/templates.js";
import { GodownElement } from "./root.js";

export class GodownAnchor extends GodownElement {
  /**
   * Href for a element.
   */
  @property() href: string = undefined;
  /**
   * Target for an element.
   */
  @property() target = "_self";
  /**
   * Arrow type.
   */
  @property() arrow: "" | "delta" | "arrow" | "angle" = "";

  static styles = [
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
  ];

  protected render(): HTMLTemplate {
    return html`<a href="${ifDefined(this.href)}" target="${this.target}">
      ${htmlSlot()}
      <i> ${this._arrowSwitcher()} </i>
    </a>`;
  }

  private _arrowSwitcher(): HTMLTemplate {
    switch (this.arrow) {
      case "delta":
        return svgDelta();
      case "arrow":
        return svgArrow(true);
      case "angle":
        return svgArrow();
      default:
        return htmlSlot("icon");
    }
  }
}

export default GodownAnchor;
