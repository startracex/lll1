import { conf, css, define, GodownElement, type HTMLTemplate, property, state } from "../deps.js";
import { deepQuerySelectorAll } from "../lib/utils.js";
import { htmlSlot } from "../tmpl.js";
import type { PropertyValueMap } from "lit";
import RouteTree from "../lib/route-tree.js";

type WithRecord<T extends string> = Record<string, any> & Record<T, string>;

const defineName = "route-view";

@define(defineName)
export class RouteView<T = unknown> extends GodownElement {
  private _routes: (WithRecord<"path"> & { component?: T })[] = [];
  private _routeTree: RouteTree = new RouteTree();

  /**
   * component will render
   */
  @state() component: T | HTMLTemplate = null;
  /**
   * dynamic parameters record
   */
  @state() params: Record<string, string> = {};
  /**
   * value of matched path in routes, or null
   */
  @state() path: string = null;
  /**
   * current pathname (location.pathname)
   */
  @property() pathname = "";

  @property() baseURL = "";
  @state() def = htmlSlot();
  @property() type: "united" | "child" | "slotted" | "field" = "united";
  @state() override = true;
  @property({ type: Boolean }) cache = false;
  record = new Map<string, ReturnType<typeof this.useRouter>>();

  set routes(v) {
    if (Object.prototype.toString.call(v) !== "[object Array]") {
      return;
    }
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

  static styles = [
    css`
      :host {
        display: contents;
      }
    `,
  ];

  reset() {
    this._routeTree = new RouteTree();
    this.record.clear();
  }

  protected render(): T | HTMLTemplate {
    if (this.cache) {
      const cached = this.record.get(this.pathname);
      if (cached) {
        Object.assign(this, cached);
        return this.component;
      }
    }
    this.params = {};
    switch (this.type) {
      case "field":
        this.component = this.fieldComponent();
        break;
      case "child":
      case "slotted":
        this.component = this.slottedComponent();
        break;
      case "united":
        this.component = this.fieldComponent() ?? this.slottedComponent();
        break;
    }
    return this.component ?? this.def;
  }

  useRouter() {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  routeChangeCallback(ur: ReturnType<typeof this.useRouter>, first: boolean) {}

  protected updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    const shouldDispatch = changedProperties.has("pathname") || changedProperties.has("path");
    if (shouldDispatch) {
      const ur = this.useRouter();
      const noRecord = !this.record.has(this.pathname);
      if (noRecord) {
        this.record.set(this.pathname, ur);
      }
      this.routeChangeCallback(ur, noRecord);
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
    const childNodes = this.querySelectorAll(":scope > *[slot]");
    if (!childNodes.length) {
      return null;
    }
    const slottedPaths = Array.from(childNodes).map((node) => {
      const slotname = node.getAttribute("slot");
      return {
        path: slotname,
      };
    });
    const tempRouteTree = new RouteTree();
    for (const withPath of slottedPaths) {
      tempRouteTree.insert(withPath.path);
    }
    if (!usedRouteTemplate) {
      usedRouteTemplate = this.useWhichRoute(this.pathname, undefined, tempRouteTree);
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

  useWhichRoute(path: string, baseURL = this.baseURL, appl: RouteTree = this._routeTree): string | null {
    return appl.useWhich(baseURL + path);
  }

  parseRouterParams(routeTemplate: string, originpath: string, appl: RouteTree = this._routeTree): Record<string, string> {
    return appl.parseParams(originpath, routeTemplate);
  }

  static updateAll() {
    const routeViewTagName = conf.namemap.get("route-view");
    if (!routeViewTagName) {
      return;
    }
    const routeViewArray = deepQuerySelectorAll<RouteView>(routeViewTagName, conf.enabled, document.body);
    routeViewArray.forEach((ArrayItem) => {
      if (!ArrayItem.override) {
        ArrayItem.pathname = window.location.pathname;
      }
    });
  }
}

export default RouteView;

declare global {
  interface HTMLElementTagNameMap {
    "route-view": RouteView;
  }
}
