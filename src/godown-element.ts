import { deepQuerySelector, deepQuerySelectorAll, doAssign, type LikeString } from "./lib/utils.js";
import EventsCollection, { EventListenerFunc } from "./lib/event-collection.js";
import type { ConfType } from "./conf";
import { LitElement } from "lit";

/**
 * Global element.
 */
class GodownElement extends LitElement {
  static conf?: ConfType;
  static elementTagName?: string;

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
   * Slot elements.
   */
  get _slots(): HTMLSlotElement[] {
    return [...this.shadowRoot.querySelectorAll<HTMLSlotElement>("slot")];
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

  private __events: EventsCollection;

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

  private __assign: void | (Record<string, any> & { classList?: DOMTokenList | string[] });

  constructor(assign: typeof GodownElement.prototype.__assign = GodownElement.conf?.assign) {
    super();
    this.__events = new EventsCollection();
    this.__assign = assign;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.__assign) {
      this.__assign.__assign = null;
      doAssign(this.__assign, this);
    }
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

  deepQuerySelector<E extends Element = HTMLElement>(selectors: Parameters<typeof deepQuerySelector>[0], root: Parameters<typeof deepQuerySelector>[1] = this): E {
    return deepQuerySelector<E>(selectors, root);
  }

  deepQuerySelectorAll<E extends Element = HTMLElement>(selectors: Parameters<typeof deepQuerySelectorAll>[0], root: Parameters<typeof deepQuerySelectorAll>[1] = this): E[] {
    return deepQuerySelectorAll<E>(selectors, root);
  }

  /**
   * Add styles to shadowRoot.
   *
   * @param styles css strings
   *
   * @example
   * ```
   * this.applyStyles(
   * "...",
   * css`...`,
   * )
   * ```
   */
  adoptStyles(...styles: LikeString[]) {
    const sheet = new CSSStyleSheet();
    styles.forEach((style) => sheet.insertRule(style.toString()));
    this.shadowRoot.adoptedStyleSheets.push(sheet);
  }
}

export default GodownElement;