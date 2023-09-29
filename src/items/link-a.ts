import { css, property, define } from "../deps.js";
import { SuperAnchor } from "./super-a.js";
import { RouteView } from "../view/route-view.js";
@define("link-a")
export class LinkAnchor extends SuperAnchor {
  @property() active = "";
  @property({ type: Boolean }) replace = false;
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
  `;
  firstUpdated() {
    this.shadowRoot.querySelector("a").addEventListener("click", this._handleClick.bind(this));
    if (this.active) {
      window.addEventListener("popstate", this.useActive.bind(this));
    }
  }
  useActive() {
    const url = new URL(this.href, window.location.href);
    if (url.origin === window.location.origin) {
      if (url.pathname === window.location.pathname) {
        this.classList.add(this.active);
      } else {
        this.classList.remove(this.active);
      }
    }
  }
  _handleClick(e: MouseEvent) {
    if (this.target !== "_self") return;
    const url = new URL(this.href, window.location.href);
    if (url.origin === window.location.origin) {
      e.preventDefault();
      if (this.replace) {
        this.replaceState();
      } else {
        this.pushState();
      }
    }
  }
  pushState(url = this.href) {
    LinkAnchor.pushState(null, "", url);
    this.active && this.useActive();
  }
  replaceState(url = this.href) {
    LinkAnchor.replaceState(null, "", url);
    this.active && this.useActive();
  }
  static pushState(data: any, unused: string, url?: string) {
    history.pushState(data, unused, url);
    RouteView.updateAll();
  }
  static replaceState(data: any, unused: string, url?: string) {
    history.replaceState(data, unused, url);
    RouteView.updateAll();
  }
}
export default LinkAnchor;
declare global {
  interface HTMLElementTagNameMap {
    "link-a": LinkAnchor;
  }
}
