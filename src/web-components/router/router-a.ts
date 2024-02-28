import { property } from "../../.deps.js";
import { define } from "../../decorators/define.js";
import GodownAnchor from "../../supers/anchor.js";
import { Router } from "./router.js";

const defineName = "router-a";

/**
 * {@linkcode RouterA} works with {@linkcode Router}.
 *
 * @extends A
 */
@define(defineName)
export class RouterA extends GodownAnchor {
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
    history.pushState(data, "", url);
    this.useActive();
    this.updateRouter();
  }

  replaceState(url = this.href, data = null) {
    history.replaceState(data, "", url);
    this.useActive();
    this.updateRouter();
  }

  updateRouter() {
    const tagName = RouterA.conf.nameMap.get("route-view");
    if (!tagName) {
      return;
    }
    const routers = this.deepQuerySelectorAll<Router>(tagName, document.body);
    routers.forEach((item) => {
      if (!item.override) {
        item.pathname = window.location.pathname;
      }
    });
  }
}

export default RouterA;

declare global {
  interface HTMLElementTagNameMap {
    "link-a": RouterA;
    "g-router-a": RouterA;
  }
}
