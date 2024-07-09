import { property } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import GodownSuperA from "../../proto/super-a.js";
import { Router } from "../router/router.js";

const protoName = "router-link";

/**
 * {@linkcode RouterLink} works with {@linkcode Router}.
 *
 * @extends A
 */
@godown(protoName)
export class RouterLink extends GodownSuperA {
  /**
   * If true, replaceState, or pushState.
   */
  @property({ type: Boolean }) replace = false;

  connectedCallback() {
    super.connectedCallback();
    this.addEvent(window, "popstate", this.useActive.bind(this));
    this.useActive();
  }

  protected _handleClick(e: MouseEvent) {
    const { sameOrigin } = this.useActive();
    if (sameOrigin) {
      e.preventDefault();
      if (this.replace) {
        this.replaceState(this.href);
      } else {
        this.pushState(this.href);
      }
    }
  }

  pushState(url = this.href, data = null) {
    history.pushState(data, "", url);
  }

  replaceState(url = this.href, data = null) {
    history.replaceState(data, "", url);
  }

  updateRouter() {
    const routers = this.deepQuerySelectorAll<Router>(Router.elementTagName, document.body);
    routers.forEach((router) => {
      if (!router.override) {
        router.pathname = window.location.pathname;
      }
    });
  }
}

export default RouterLink;
