import { conf, css, define, GlobalSTD, HtmlTemplate, property } from "../deps.js";
import { htmlSlot } from "../tmpl.js";
import type { PropertyValueMap } from "lit";

type WithRecord<T extends string> = Record<string, any> & Record<T, string>;

@define("route-view")
export class RouteView<T = unknown> extends GlobalSTD {
  private _routes: (WithRecord<"path"> & { component?: T })[] = [];

  component: T | HtmlTemplate = null;
  params: Record<string, string> = {};
  path: string = undefined;
  @property() pathname = "";

  record = new Map<string, ReturnType<typeof this.useRouter>>();

  @property() baseURL = "";
  @property() def = htmlSlot();
  @property() type: "united" | "child" | "slotted" | "field" = "united";
  @property({ type: Boolean, attribute: false }) override = true;
  @property({ type: Boolean }) cache = false;
  @property({ type: Boolean }) static = false;

  set routes(v) {
    if (Object.prototype.toString.call(v) !== "[object Array]") {
      this._routes = [];
      return;
    }
    if (this.static) {
      this._routes = v;
    } else {
      this._routes = RouteView.sortRoutesPaths(v);
    }
    this.requestUpdate();
  }

  get routes() {
    return this._routes;
  }

  static styles = css`
    :host {
      display: contents;
    }
  `;

  render() {
    if (this.cache) {
      const cached: ReturnType<typeof this.useRouter> | undefined = this.record.get(this.pathname);
      if (cached) {
        return cached.component;
      }
    }
    switch (this.type) {
      case "field":
        this.component = this.render_field();
        break;
      case "child":
      case "slotted":
        this.component = this.render_slotted();
        break;
      case "united":
        this.component = this.render_united();
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  routeChangeCallback(ur: ReturnType<typeof this.useRouter>, first: boolean) {}

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    const pathnameChange = _changedProperties.has("pathname");
    if (pathnameChange) {
      const ur = this.useRouter();
      const noRecord = !this.record.has(this.pathname);
      if (noRecord) {
        this.record.set(this.pathname, ur);
      }
      this.routeChangeCallback(ur, noRecord);
      this.dispatchEvent(new CustomEvent("change", { detail: ur }));
    }
  }

  private render_united(): ReturnType<typeof this.render_slotted | typeof this.render_field> {
    const slottedComponent = this.render_slotted();
    if (slottedComponent) {
      return slottedComponent;
    }
    return this.render_field();
  }

  private render_slotted(): ReturnType<typeof this.slottedComponent> {
    const childNodes = this.querySelectorAll(":scope > *[slot]");
    if (!childNodes.length) {
      return null;
    }
    const slots = Array.from(childNodes).map((node) => {
      const slotname = node.getAttribute("slot");
      return {
        path: this.baseURL + slotname,
        slotname,
      };
    });
    let slotsSort: WithRecord<"path">[];
    if (this.static) {
      slotsSort = slots;
    } else {
      slotsSort = RouteView.sortRoutesPaths(slots);
    }
    this.path = RouteView.useWhichRoute(slotsSort, this.pathname);
    return this.slottedComponent(this.path, slotsSort);
  }

  private render_field(): ReturnType<typeof this.fieldComponent> {
    this.path = RouteView.useWhichRoute(this.routes, this.pathname);
    this.params = RouteView.parseRouterParams(this.path, this.pathname);
    return this.fieldComponent(this.path);
  }

  fieldComponent(usedRouteTemplate: string): null | T {
    if (!usedRouteTemplate) {
      return null;
    }
    const route = this.routes.find((r) => r.path === usedRouteTemplate);
    if (!route) {
      return null;
    }
    return route.component;
  }

  slottedComponent(usedRouteTemplate: string, ObjectArrayIncludePath: WithRecord<"path">[]): null | HtmlTemplate {
    if (!usedRouteTemplate) {
      return null;
    }
    const slotElement = ObjectArrayIncludePath.find((s) => s.path === usedRouteTemplate);
    if (!slotElement) {
      return null;
    }
    this.params = RouteView.parseRouterParams(usedRouteTemplate, this.pathname);
    return htmlSlot(slotElement.slotname);
  }

  static sortRoutesPaths(ObjectArrayIncludePath: WithRecord<"path">[]): WithRecord<"path">[] {
    const all = ObjectArrayIncludePath.map((route: { path: string }) => {
      const path = route.path;
      const pathArray = path.split("/");
      const __dynamicRouteCount = pathArray.filter((p) => p.startsWith(":")).length;
      return {
        ...route,
        path,
        __dynamicRouteCount,
      };
    });
    const allSort = all.sort((a, b) => a.__dynamicRouteCount - b.__dynamicRouteCount);
    const multi = allSort.filter((route) => {
      const path = route.path;
      const pathArray = path.split("/");
      const multi_dynamicRouteCount = pathArray.filter((p) => p.startsWith("...") || p.startsWith("*")).length;
      return multi_dynamicRouteCount > 0;
    });
    multi.sort((a, b) => {
      const aIndex = a.path.split("/").findIndex((template: string) => template.startsWith("...") || template.startsWith("*"));
      const bIndex = b.path.split("/").findIndex((template: string) => template.startsWith("...") || template.startsWith("*"));
      return aIndex !== -1 && bIndex !== -1 ? bIndex - aIndex : 0;
    });
    const sigle = allSort.filter((route) => {
      const path = route.path;
      const pathArray = path.split("/");
      const multi_dynamicRouteCount = pathArray.filter((p) => p.startsWith("...") || p.startsWith("*")).length;
      return multi_dynamicRouteCount === 0;
    });
    return [...sigle, ...multi].map((i) => {
      delete i.__dynamicRouteCount;
      return i;
    });
  }

  static useWhichRoute(ObjectArrayIncludePath: WithRecord<"path">[], path: string, baseURL = ""): string | null {
    const originpath = baseURL + path;
    const originsplits = originpath.split("/").slice(1);
    const routes = ObjectArrayIncludePath;
    const pathTemplateArray = routes.map((r) => r.path);
    for (const pathTemplate of pathTemplateArray) {
      const pathsplits = pathTemplate.split("/").slice(1);
      const ifmatched = pathsplits.every((pathsplit, index) => {
        const originsplit = originsplits[index];
        if (pathsplit.startsWith(":")) {
          return originsplits.length <= pathsplits.length;
        } else if (pathsplit.startsWith("...")) {
          return originsplits.length >= pathsplits.length;
        } else {
          return originsplits.length === pathsplits.length && originsplit === pathsplit;
        }
      });
      if (ifmatched) {
        return pathTemplate;
      }
    }
    return null;
    /* 
    const originpath: string = baseURL + path;
    const routes = ObjectArrayIncludePath as Array<{ path?: string; }>;
    const pathTemplateArray = routes.map((r) => r.path) as Array<string>;
    for (const pathTemplate of pathTemplateArray) {
      const pathsplits = pathTemplate.split("/").slice(1);
      const reg = new RegExp(pathsplits.map((s: string) => {
        if (s.startsWith(":")) {
          return "^\/[^\/]+$";
        } else if (s.startsWith("...") || s.startsWith("*")) {
          return ".*";
        } else {
          return s;
        }
      }).join("/") + "$");
      if (reg.test(originpath)) {
        return pathTemplate;
      }
    }
    return null;
    */
  }

  static parseRouterParams(routeTemplate: string, originpath: string): Record<string, string> {
    if (!routeTemplate || !originpath) {
      return;
    }
    const params: Record<string, string> = {};
    const originpathArray = originpath.split("/").splice(1);
    const routeTemplateSplit = routeTemplate.split("/").splice(1);
    for (const [index, path] of routeTemplateSplit.entries()) {
      if (path.startsWith(":")) {
        params[path.slice(1)] = originpathArray[index];
      } else if (path.startsWith("*")) {
        params[path.slice(1)] = originpathArray.slice(index).join("/");
      } else if (path.startsWith("...")) {
        params[path.slice(3)] = originpathArray.slice(index).join("/");
      } else {
        if (path !== originpathArray[index]) {
          return;
        }
      }
    }
    return params;
  }

  static updateAll() {
    const routeViewTagName = conf.namemap.get("route-view");
    if (!routeViewTagName) {
      return;
    }
    const routeViewArray = document.querySelectorAll<RouteView>(routeViewTagName);
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
