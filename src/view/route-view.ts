import type { TemplateResult } from "lit";
import { conf, css, define, html, LitElement, property } from "../deps.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
@define("route-view")
export class RouteView extends LitElement {
  _routes: Array<{ path: string; [key: string]: any }> = [];
  params: Record<string, string> = {};
  @property({ type: Boolean }) static = false;
  @property() type: "united" | "child" | "slotted" | "field" = "united";
  @property() baseURL = "";
  @property() path = "";
  @property({ type: Boolean }) override = false;
  @property({ type: Object }) compoent = null;
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
    if (this.type === "field") {
      return this.render_field() ?? html`<slot></slot>`;
    }
    if (this.type === "slotted" || this.type === "child") {
      return this.render_slotted() ?? html`<slot></slot>`;
    }
    return this.render_united() ?? html`<slot></slot>`;
  }
  useRouter() {
    return {
      path: this.path,
      params: this.params,
    };
  }
  connectedCallback(): void {
    super.connectedCallback();
    this.path = window.location.pathname;
    window.addEventListener("popstate", (e) => {
      this.path = window.location.pathname;
    });
    if (!this.override) return;
    const pushHistory = history.pushState;
    history.pushState = function () {
      pushHistory.apply(this, arguments);
      this.path = window.location.pathname;
    };
    const replaceHistory = history.replaceState;
    history.replaceState = function () {
      replaceHistory.apply(this, arguments);
      this.path = window.location.pathname;
    };
  }
  render_united() {
    const slottedCompoent = this.render_slotted();
    if (slottedCompoent) return slottedCompoent;
    const Compoent = this.render_field();
    return Compoent;
  }
  render_slotted() {
    const childNodes = this.querySelectorAll(":scope > *[slot]");
    const slots = Array.from(childNodes).map((node) => {
      const slotname = node.getAttribute("slot");
      return {
        path: this.baseURL + slotname,
        slotname,
      };
    }) as Array<{ path: string; slotname: string }>;
    let slotsSort: any[];
    if (this.static) {
      slotsSort = slots;
    } else {
      slotsSort = RouteView.sortRoutesPaths(slots);
    }
    const usedRouteTemplate = RouteView.useWhichRoute(slotsSort, this.path);
    const Compoent = this.slottedCompoent(usedRouteTemplate, slotsSort);
    return Compoent;
  }
  render_field() {
    const usedRouteTemplate = RouteView.useWhichRoute(this.routes, this.path);
    const RouterParmasObject = RouteView.parseRouterParams(usedRouteTemplate, this.path);
    this.params = RouterParmasObject;
    const Compoent = this.fieldComponent(usedRouteTemplate);
    return Compoent;
  }
  fieldComponent(usedRouteTemplate: string): null | TemplateResult {
    if (!usedRouteTemplate) return;
    const route = this.routes.find((r) => r.path === usedRouteTemplate);
    if (!route) return null;
    return route.component || (route.html ? unsafeHTML(route.html) : null);
  }
  slottedCompoent(usedRouteTemplate: string, ObjectArrayIncludePath: Array<{ path: string; slotElement?: string; [key: string]: any }>): null | TemplateResult {
    if (!usedRouteTemplate) return;
    const slotElement = ObjectArrayIncludePath.find((s) => s.path === usedRouteTemplate);
    if (!slotElement) return null;
    const RouterParmasObject = RouteView.parseRouterParams(usedRouteTemplate, this.path);
    this.params = RouterParmasObject;
    return html`<slot name="${slotElement.slotname}"></slot>` as TemplateResult;
  }
  static sortRoutesPaths(ObjectArrayIncludePath: Array<{ path: string; [key: string]: any }>): Array<{ path: string }> {
    const all = ObjectArrayIncludePath.map((route: { path: string }) => {
      const path = route.path;
      const pathArray = path.split("/");
      const Single_dynamicRouteCount = pathArray.filter((p) => p.startsWith(":")).length;
      return {
        ...route,
        path,
        Single_dynamicRouteCount,
      };
    });
    const allSort = all.sort((a, b) => a.Single_dynamicRouteCount - b.Single_dynamicRouteCount);
    const multi = allSort.filter((route) => {
      const path = route.path;
      const pathArray = path.split("/");
      const double_dynamicRouteCount = pathArray.filter((p) => p.startsWith("...") || p.startsWith("*")).length;
      return double_dynamicRouteCount > 0;
    });
    multi.sort((a, b) => {
      const aIndex = a.path.split("/").findIndex((template: string) => template.startsWith("...") || template.startsWith("*"));
      const bIndex = b.path.split("/").findIndex((template: string) => template.startsWith("...") || template.startsWith("*"));
      return aIndex !== -1 && bIndex !== -1 ? bIndex - aIndex : 0;
    });
    const sigle = allSort.filter((route) => {
      const path = route.path;
      const pathArray = path.split("/");
      const double_dynamicRouteCount = pathArray.filter((p) => p.startsWith("...") || p.startsWith("*")).length;
      return double_dynamicRouteCount === 0;
    });
    return [...sigle, ...multi];
  }
  static useWhichRoute(ObjectArrayIncludePath: Array<{ path: string; [key: string]: any }>, path: string, baseURL: string = "") {
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
    if (!routeTemplate || !originpath) return;
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
    const routeViewArray = document.querySelectorAll(`${routeViewTagName}:not([override])`) as unknown as Array<RouteView>;
    for (let index: number = 0, ArrayItem: RouteView; (ArrayItem = routeViewArray[index]); index++) {
      ArrayItem.path = window.location.pathname;
    }
  }
}
export default RouteView;
declare global {
  interface HTMLElementTagNameMap {
    "route-view": RouteView;
  }
}
