import { css, CSSResultGroup, LitElement, unsafeCSS } from "lit";
import { deepQuerySelector, deepQuerySelectorAll } from "./lib/utils.js";
import { EventListenerFunc, EventsCollection } from "./lib/event-collection.js";
import { conf } from "./conf.js";
import type { LikeString } from "./with";

/**
 * Custom CSS variable prefix, join with "--".
 */
export const cssvar = unsafeCSS("--" + conf.cssvar.replace(/[^a-zA-Z0-9\\-]/g, ""));

/**
 * Global element.
 */
export class GodownElement extends LitElement {
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

  /**
   * No named slot element's assignedElements, as HTMLElement[].
   */
  get assigned(): HTMLElement[] {
    return this._slot?.assignedElements() as HTMLElement[];
  }

  /**
   * No named slot element's assignedElements, as Node[].
   */
  get assignedNodes(): Node[] {
    return this._slot?.assignedNodes();
  }

  /**
   * No named slot element.
   */
  get _slot(): HTMLSlotElement {
    return this.shadowRoot.querySelector<HTMLSlotElement>("slot:not([name])");
  }

  /**
   * Named slot elements.
   */
  get slottedChildren(): HTMLSlotElement[] {
    return [...this.querySelectorAll<HTMLSlotElement>("[slot]")];
  }

  /**
   * Named slot elements' slot attribute.
   */
  get slottedNames(): string[] {
    return this.slottedChildren.map((c) => c.getAttribute("slot")).filter((v) => v);
  }

  /**
   * Width of (`this.offsetParent` or `document.body`).
   */
  get offsetsWidth(): number {
    return this.offsetParent?.clientWidth ?? document.body.offsetWidth;
  }

  /**
   * Height of (`this.offsetParent` or `document.body`).
   */
  get offsetsHeight(): number {
    return this.offsetParent?.clientHeight ?? document.body.offsetHeight;
  }

  __events = new EventsCollection();

  /**
   * ```
   * src.addEventListener("type", listener)
   * //as
   * this.addEvent(src, "type", listener)
   * ```
   */
  addEvent(src: any, type: string, listener: EventListenerFunc, alias?: string) {
    this.__events.addEvent(src, type, listener, alias);
  }

  /**
   * ```
   * src.removeEventListener("type", listener)
   * //as
   * this.removeEvent(src, "type", listener)
   * ```
   */
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

  deepQuerySelector<E extends Element = HTMLElement>(selectors: Parameters<typeof deepQuerySelector>[0], ignore: Parameters<typeof deepQuerySelector>[1] = conf.enabled, root: Parameters<typeof deepQuerySelector>[2] = this): E {
    return deepQuerySelector<E>(selectors, ignore, root);
  }

  deepQuerySelectorAll<E extends Element = HTMLElement>(selectors: Parameters<typeof deepQuerySelectorAll>[0], ignore: Parameters<typeof deepQuerySelectorAll>[1] = conf.enabled, root: Parameters<typeof deepQuerySelectorAll>[2] = this): E[] {
    return deepQuerySelectorAll<E>(selectors, ignore, root);
  }

  /**
   * Add styles to shadowRoot.
   *
   * @param styles css strings
   *
   * @example
   * ```
   * this.applyStyles([
   * "...",
   * css`...`,
   * ])
   * ```
   */
  adoptStyles(styles: LikeString[]) {
    const sheet = new CSSStyleSheet();
    styles.forEach((style) => sheet.insertRule(style.toString()));
    this.shadowRoot.adoptedStyleSheets.push(sheet);
  }
}

GodownElement.disableWarning("change-in-update");
