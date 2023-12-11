import { css, CSSResultGroup, LitElement, unsafeCSS, type WarningKind } from "lit";
import { EventListenerFunc, EventsCollection } from "./lib/event-collection.js";
import { conf } from "./conf.js";

/**
 * Custom CSS variable prefix, join with "--".
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

  /**
   * no named slot
   */
  get _slot() {
    return this.shadowRoot.querySelector("slot:not([name])") as HTMLSlotElement;
  }

  get slottedChildren() {
    return [...this.querySelectorAll<HTMLElement>("[slot]")];
  }

  get slottedNames() {
    return this.slottedChildren.map((c) => c.getAttribute("slot")).filter((v) => v);
  }

  get offsetsWidth() {
    return this.offsetParent?.clientWidth ?? document.body.offsetWidth;
  }

  get offsetsHeight() {
    return this.offsetParent?.clientHeight ?? document.body.offsetHeight;
  }

  __events = new EventsCollection();

  addEvent(src: any, type: string, listener: EventListenerFunc, alias?: string) {
    this.__events.addEvent(src, type, listener, alias);
  }

  removeEvent(src: any, type: string, id: string | EventListenerFunc) {
    this.__events.removeEvent(src, type, id);
  }

  removeAllEvents() {
    this.__events.removeAllEvents();
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
    this.connectedCallback();
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
