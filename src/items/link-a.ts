import { define, property } from "../deps.js";
import { RouteView } from "../view/route-view.js";
import { SuperAnchor } from "./super-a.js";

const defineName = "link-a";

@define(defineName)
export class LinkAnchor extends SuperAnchor {
  @property({ type: Boolean, reflect: true }) active = false;
  @property({ type: Boolean }) replace = false;
  static styles = SuperAnchor.styles;

  connectedCallback() {
    super.connectedCallback();
    this.addEvent(this, "click", this._handleClick);
    this.addEvent(window, "popstate", this.useActive.bind(this));
    this.useActive();
  }

  useActive() {
    const url = new URL(this.href, window.location.href);
    if (url.origin === window.location.origin) {
      this.active = url.pathname === window.location.pathname;
    }
  }

  protected _handleClick(e: MouseEvent) {
    const href = this.href ?? this.querySelector("[href]")?.getAttribute("href");
    const url = new URL(href, window.location.href);
    if (url.origin === window.location.origin) {
      e.preventDefault();
      if (this.replace) {
        this.replaceState(href);
      } else {
        this.pushState(href);
      }
    }
  }

  pushState(url = this.href, data = null) {
    LinkAnchor.pushState(data, "", url);
    this.useActive();
  }

  replaceState(url = this.href, data = null) {
    LinkAnchor.replaceState(data, "", url);
    this.useActive();
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
