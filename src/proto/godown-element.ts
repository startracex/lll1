import { LitElement, type PropertyValues } from "lit";

import { type AddOptions, EventsCollection, type EventsNames, type ListenerFunc } from "../lib/event-coll.js";
import { deepQuerySelector, deepQuerySelectorAll } from "../lib/utils.js";
import { type GodownConfig } from "./godown-config";

/**
 * Global element.
 */
export class GodownElement extends LitElement {
  static godownConfig?: GodownConfig;

  static elementTagName?: string;

  static protoName?: string;

  static define() {
    if (!this.isDefined()) {
      this.godownConfig.define(this.elementTagName, this);
    }
  }

  static isDefined(): boolean {
    return !!customElements.get(this.elementTagName);
  }

  queryPart<E extends HTMLElement>(p: string) {
    return this.shadowRoot.querySelector<E>(`[part=${p}]`);
  }

  get assignedElements(): HTMLElement[] {
    return this._slot?.assignedElements() as HTMLElement[];
  }

  /**
   * No named slot element's assignedElements, as HTMLElement[].
   */
  get assigned(): HTMLElement[] {
    return this.assignedElements;
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
   * Named slotted elements.
   */
  get slottedChildren(): HTMLSlotElement[] {
    return [...this.querySelectorAll<HTMLSlotElement>("[slot]")];
  }

  /**
   * Named slotted elements' slot attribute.
   */
  get slottedNames(): string[] {
    return this.slottedChildren.map((c) => c.getAttribute("slot")).filter((v) => v);
  }

  /**
   * Query for a element with slot names
   *
   * @param slotName Slot name.
   * @returns Slot element.
   */
  querySlot(slotName: string): HTMLSlotElement | null {
    return this.querySelector<HTMLSlotElement>(`[slot=${slotName}]`);
  }

  get offsets() {
    return this.offsetParent || document.body;
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
  addEvent<SRC extends EventTarget = HTMLElement>(
    src: SRC,
    type: EventsNames,
    listener: ListenerFunc,
    options?: AddOptions,
  ): ListenerFunc {
    return this.__events.addEvent(src, type, listener, options);
  }

  /**
   * ```
   * src.removeEventListener("type", listener)
   * //as
   * this.removeEvent(src, "type", listener)
   * ```
   */
  removeEvent<SRC extends EventTarget = HTMLElement>(src: SRC, type: EventsNames, listener: ListenerFunc) {
    this.__events.removeEvent(src, type, listener);
  }

  removeAllEvents() {
    this.__events.removeAllEvents();
  }

  private assign: void | Record<string, any>;

  private __stylex: { css?: string; index?: number; lazy?: string };

  get stylex(): string | undefined {
    return this.__stylex.css;
  }

  /**
   * Appends to `shadowRoot.adoptedStyleSheets` and overrides the initial style (constructor.styles).
   *
   * If there is no selector, it will be `:host`.
   *
   * Resetting will remove the previous stylex.
   *
   * @parma sx CSS string.
   *
   * @example
   * ```html
   * <custom-element stylex=":host{--key:value;}"></custom-element>
   * <custom-element stylex="--key:value;"></custom-element>
   * ```
   */
  set stylex(sx: string) {
    sx = sx.trim();
    if (!/^(([\s\S]+)\{)(([\s\S]+)\})$/.test(sx)) {
      sx = `:host{${sx}}`;
    }
    this.setAttribute("stylex", sx);
    if (!this.shadowRoot) {
      this.__stylex.lazy = sx;
      return;
    }
    if (this.__stylex.index) {
      this.shadowRoot.adoptedStyleSheets.splice(this.__stylex.index, 1);
    }
    this.__stylex.css = sx;
    this.__stylex.index = this.adoptStyles(sx);
  }

  constructor(assignInit: typeof GodownElement.prototype.assign) {
    super();
    this.__events = new EventsCollection();
    this.__stylex = {};
    this.assign = {
      ...(GodownElement.godownConfig?.assign || {}),
      ...assignInit,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.assign) {
      Object.assign(this, this.assign);
      this.assign = null;
    }
    const { lazy } = this.__stylex;
    if (lazy) {
      this.adoptStyles(lazy);
    }
  }

  disconnectedCallback() {
    this.removeAllEvents();
  }

  mount(arg?: PropertyValues) {
    this.firstUpdated(arg);
  }

  unmount() {
    this.disconnectedCallback();
  }

  remount(arg?: PropertyValues) {
    this.unmount();
    this.connectedCallback();
    this.mount(arg);
  }

  deepQuerySelector<E extends Element = HTMLElement>(
    selectors: Parameters<typeof deepQuerySelector>[0],
    root: Parameters<typeof deepQuerySelector>[1] = this,
  ): E {
    return deepQuerySelector<E>(selectors, root);
  }

  deepQuerySelectorAll<E extends Element = HTMLElement>(
    selectors: Parameters<typeof deepQuerySelectorAll>[0],
    root: Parameters<typeof deepQuerySelectorAll>[1] = this,
  ): E[] {
    return deepQuerySelectorAll<E>(selectors, root);
  }

  /**
   * Add styles to shadowRoot.
   *
   * @param styles CSS strings.
   * @returns Index of injected style.
   *
   * @example
   * ```
   * this.applyStyles(
   * "...",
   * css`...`,
   * )
   * ```
   */
  adoptStyles(...styles: LikeString[]): number {
    const stack = this.shadowRoot.adoptedStyleSheets;
    if (styles.length) {
      const sheet = new CSSStyleSheet();
      styles.forEach((style) => sheet.insertRule(style.toString()));
      stack.push(sheet);
    }
    return stack.length - 1;
  }
}

export default GodownElement;
export interface LikeString {
  toString(): string;
}

export type HTMLEvent<H = HTMLElement, E = Event> = {
  target: H;
  [key: string]: unknown;
} & E;
