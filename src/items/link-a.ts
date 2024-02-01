import { define } from "../root.js";
import { property } from "../deps.js";
import { RouteView } from "../view/route-view.js";
import { SuperAnchor } from "./super-a.js";

const defineName = "link-a";

/**
 * LinkAnchor works with {@linkcode RouteView}.
 *
 * @extends SuperAnchor
 */
@define(defineName)
export class LinkAnchor extends SuperAnchor {
  /**
   * True when the href is in the same pathname as the location.
   */
  @property({ type: Boolean, reflect: true }) active = false;
  /**
   * If true, replaceState, or pushState.
   */
  @property({ type: Boolean }) replace = false;

  connectedCallback() {
    super.connectedCallback();
    this.addEvent(this, "click", this._handleClick);
    this.addEvent(window, "popstate", this.useActive.bind(this));
    this.useActive();
  }

  /**
   * Set active to true when the {@linkcode LinkAnchor.href} is in the same pathname as the location.
   */
  useActive() {
    const url = new URL(this.href, location.href);
    if (url.origin === location.origin) {
      this.active = url.pathname === location.pathname;
    }
  }

  protected _handleClick(e: MouseEvent) {
    const href = this.href ?? this.querySelector("[href]")?.getAttribute("href");
    const url = new URL(href, location.href);
    if (url.origin === location.origin) {
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
