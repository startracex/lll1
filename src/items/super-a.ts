import { css, define, html, ifDefined, property } from "../deps.js";
import STD from "./std.js";
@define("super-a")
export class SuperAnchor extends STD {
  @property() href: string = undefined;
  @property() target = "_self";
  @property() arrow: "" | "delta" | "arrow" | "angle" = "";
  static styles = css`
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
  `;
  render() {
    return html`<a href=${ifDefined(this.href)} target=${this.target}>
      <slot name="pre"></slot><slot></slot><slot name="suf"></slot>
      <i style="font-style:normal"><slot name="icon"></slot>${this._arrowSwitcher()}</i>
    </a>`;
  }
  _arrowSwitcher() {
    switch (this.arrow) {
      case "delta":
        return html`<svg viewBox="0 0 48 48" fill="none"><path d="M20 12L32 24L20 36V12Z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round" /></svg>`;
      case "arrow":
        return html`<svg width="38" height="38" viewBox="0 0 48 48" fill="none">
          <path d="M36 24.0083H12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M24 12L36 24L24 36" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`;
      case "angle":
        return html`<svg viewBox="0 0 48 48" fill="none"><path d="M19 12L31 24L19 36" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
    }
  }
}
export default SuperAnchor;
declare global {
  interface HTMLElementTagNameMap {
    "super-a": SuperAnchor;
  }
}
