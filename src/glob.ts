import { css, CSSResultGroup, LitElement, unsafeCSS, type WarningKind } from "lit";
import { conf } from "./conf.js";

/**
 * Custom CSS variable,join with "--" ,only allow `a-Z,0-9,-`
 */
export const cssvar = unsafeCSS("--" + conf.cssvar.replace(/[^a-zA-Z0-9\\-]/g, ""));

export class GlobalSTD extends LitElement {
  static styles = css`
    :host {
      ${cssvar}--text-selection: inherit;
      ${cssvar}--text-selection-background: none;
    }

    * {
      font-size: 100%;
      font-style: normal;
      color: inherit;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      border: 0;
      outline: 0;
    }

    ::selection {
      color: var(${cssvar}--text-selection);
      background: var(${cssvar}--text-selection-background);
    }
  ` as CSSResultGroup;

  get assigned() {
    return this._slot?.assignedElements() as HTMLElement[];
  }

  get assignedNodes() {
    return this._slot?.assignedNodes();
  }

  get _slot() {
    return this.shadowRoot.querySelector("slot:not([name])") as HTMLSlotElement;
  }

  get offsetsWidth() {
    return this.offsetParent?.clientWidth ?? document.body.offsetWidth;
  }

  get offsetsHeight() {
    return this.offsetParent?.clientHeight ?? document.body.offsetHeight;
  }

  protected EventsCollection = new Map<string, Map<any, Set<ListenerFunc>>>();
  protected ListenersAlias = new Map<string, ListenerFunc>();

  addEvent(src: any, type: string, listener: ListenerFunc, alias?: string) {
    const gotType = this.EventsCollection.get(type);
    if (gotType) {
      const gotEle = gotType.get(src);
      if (gotEle) {
        gotEle.add(listener);
      } else {
        const s = new Set<ListenerFunc>();
        s.add(listener);
        gotType.set(src, s);
      }
    } else {
      const s = new Set<ListenerFunc>();
      s.add(listener);
      const m = new Map<any, Set<ListenerFunc>>();
      m.set(src, s);
      this.EventsCollection.set(type, m);
    }
    src.addEventListener(type, listener);
    if (alias) {
      this.ListenersAlias.set(alias, listener);
    }
  }

  removeEvent(src: any, type: string, id: string | ListenerFunc) {
    const gotType = this.EventsCollection.get(type);
    if (gotType) {
      const gotEle = gotType.get(src);
      if (gotEle) {
        if (typeof id === "string") {
          const listener = this.ListenersAlias.get(id);
          if (listener) {
            gotEle.delete(listener);
            src.removeEventListener(type, listener);
          }
        } else {
          gotEle.forEach((listener) => {
            src.removeEventListener(type, listener);
          });
        }
        if (gotEle.size === 0) {
          gotType.delete(src);
        }
        if (gotType.size === 0) {
          this.EventsCollection.delete(type);
        }
      }
    }
  }

  removeAllEvents() {
    this.EventsCollection.forEach((typeMap, type) => {
      typeMap.forEach((eventListeners, src) => {
        eventListeners.forEach((listener) => {
          src.removeEventListener(type, listener);
        });
      });
      typeMap.clear();
      this.EventsCollection.delete(type);
    });
    this.ListenersAlias.clear();
  }

  disconnectedCallback() {
    this.removeAllEvents();
  }

  mount(arg?: any) {
    this.firstUpdated(arg);
  }

  unmount() {
    this.disconnectedCallback();
  }

  remount(arg?: any) {
    this.unmount();
    this.mount(arg);
  }
}

export function DisableWarning(e: { disableWarning?: (warningKind: WarningKind) => void }, ...w: WarningKind[]) {
  if (w.length) {
    for (const ww of w) {
      e.disableWarning?.(ww);
    }
  } else {
    e.disableWarning?.("change-in-update");
  }
}

type ListenerFunc = (...args: any[]) => any;
