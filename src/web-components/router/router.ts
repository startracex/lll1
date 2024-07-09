import { css, property, type PropertyValueMap, state } from "../../_deps.js";
import conf from "../../conf.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { htmlSlot, type HTMLTemplate } from "../../lib/directives.js";
import RouteTree from "../../lib/route-tree.js";
import { deepQuerySelectorAll } from "../../lib/utils.js";
import { GodownElement } from "../../proto/godown-element.js";

type WithRecord<T extends string> = Record<string, any> & Record<T, string>;

const protoName = "router";

/**
 * {@linkcode Router} has basic routing control.
 *
 * To switch routes, use history api or router-link.
 */
@godown(protoName)
@styles(css`
  :host {
    display: contents;
  }
`)
export class Router<T = unknown> extends GodownElement {
  private _routes: (WithRecord<"path"> & { component?: T })[] = [];
  private _routeTree: RouteTree = new RouteTree();

  /**
   * Component will render.
   */
  @state() component: T | HTMLTemplate = null;
  /**
   * Dynamic parameters record.
   */
  @state() params: Record<string, string> = {};
  /**
   * Value of matched path in routes, or null.
   */
  @state() path: string = null;
  /**
   * Current pathname (location.pathname).
   */
  @property() pathname = "";
  /**
   * Path prefix.
   */
  @property() baseURL = "";
  /**
   * Rendered content when there is no match.
   */
  @state() default: HTMLTemplate = htmlSlot();
  /**
   * The type of routing query.
   */
  @property() type: "united" | "slotted" | "field" = "united";
  /**
   * Rewrite history.
   */
  @state() override = true;
  /**
   * Cache accessed.
   */
  @property({ type: Boolean }) cache = false;

  /**
   * Cache record.
   */
  record = new Map<string, ReturnType<typeof this.useRouter>>();

  set routes(v) {
    this._routes = v;
    this.reset();
    for (const route of v) {
      this._routeTree.insert(route.path);
    }
    this.requestUpdate();
  }

  get routes() {
    return this._routes;
  }

  reset() {
    this._routeTree = new RouteTree();
    this.record.clear();
  }

  protected render(): T | HTMLTemplate {
    this.params = {};
    if (this.cache) {
      const cached = this.record.get(this.pathname);
      if (cached) {
        Object.assign(this, cached);
        return this.component;
      }
    }
    switch (this.type) {
      case "field":
        this.component = this.fieldComponent();
        break;
      case "slotted":
        this.component = this.slottedComponent();
        break;
      case "united":
        this.component = this.fieldComponent() ?? this.slottedComponent();
        break;
    }
    return this.component ?? this.default;
  }

  useRouter(): { path: string; component: HTMLTemplate | T; params: Record<string, string>; pathname: string } {
    return {
      pathname: this.pathname,
      params: this.params,
      path: this.path,
      component: this.component,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.pathname = window.location.pathname;
    if (!this.override) {
      return;
    }
    this.addEvent(window, "popstate", () => {
      this.pathname = window.location.pathname;
    });
    const self = this;
    const pushHistory = history.pushState;

    const { override } = conf;
    if (!override.pushState) {
      override.pushState = pushHistory;
    }
    history.pushState = function () {
      pushHistory.apply(this, arguments);
      self.pathname = window.location.pathname;
    };
    const replaceHistory = history.replaceState;
    history.replaceState = function () {
      replaceHistory.apply(this, arguments);
      self.pathname = window.location.pathname;
    };
  }

  /**
   *
   * @param ur value of useRouter()
   * @param first whether this path is loaded for the first time
   */
  routeChangeCallback: (ur: ReturnType<typeof this.useRouter>, first: boolean) => void = null;

  protected updated(changedProperties: PropertyValueMap<this>) {
    const shouldDispatch = changedProperties.has("pathname") || changedProperties.has("path");
    if (shouldDispatch) {
      const ur = this.useRouter();
      const noRecord = !this.record.has(this.pathname);
      if (noRecord) {
        this.record.set(this.pathname, ur);
      }
      this.routeChangeCallback?.(ur, noRecord);
      this.dispatchEvent(new CustomEvent("change", { detail: ur }));
    }
  }

  fieldComponent(usedRouteTemplate?: string): null | T {
    if (!usedRouteTemplate) {
      usedRouteTemplate = this.useWhichRoute(this.pathname);
    }
    this.path = usedRouteTemplate;
    if (!usedRouteTemplate) {
      return null;
    }
    this.params = this.parseRouterParams(this.path, this.pathname);
    const route = this.routes.find((r) => r.path === usedRouteTemplate);
    if (!route) {
      return null;
    }
    return route.component;
  }

  slottedComponent(usedRouteTemplate?: string): null | HTMLTemplate {
    const childNodes = this.slottedChildren;
    if (!childNodes.length) {
      return null;
    }
    const slottedPaths = Array.from(childNodes).map((node) => {
      const slotName = node.getAttribute("slot");
      return {
        path: slotName,
      };
    });
    const tempRouteTree = new RouteTree();
    for (const withPath of slottedPaths) {
      tempRouteTree.insert(withPath.path);
    }
    if (!usedRouteTemplate) {
      usedRouteTemplate = tempRouteTree.useWhich(this.pathname);
      if (!usedRouteTemplate) {
        return null;
      }
    }
    const slotElement = slottedPaths.find((s) => s.path === usedRouteTemplate);
    if (!slotElement) {
      return null;
    }
    this.params = this.parseRouterParams(usedRouteTemplate, this.pathname);
    return htmlSlot(slotElement.path);
  }

  useWhichRoute(path: string): string | null {
    return this._routeTree.useWhich(this.baseURL + path);
  }

  parseRouterParams(routeTemplate: string, path: string): Record<string, string> {
    return this._routeTree.parseParams(path, routeTemplate);
  }

  static updateAll() {
    const routeViewArray = deepQuerySelectorAll<Router>(Router.elementTagName, document.body);
    routeViewArray.forEach((ArrayItem) => {
      if (!ArrayItem.override) {
        ArrayItem.pathname = window.location.pathname;
      }
    });
  }
}

export default Router;
