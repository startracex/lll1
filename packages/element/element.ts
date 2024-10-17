import { LitElement, type PropertyValues } from "lit";

import GodownConfig from "./config.js";
import { deepQuerySelector, deepQuerySelectorAll } from "./tools/dom.js";
import { Events } from "./tools/events.js";

class GodownElement extends LitElement {
  static godownConfig?: GodownConfig;

  static elementTagName?: string;

  static elementCategory?: any;

  static protoName?: string;

  static define(tagName = this.elementTagName) {
    if (!this.isDefined()) {
      (this.godownConfig || customElements).define(tagName, this);
    }
  }

  static isDefined(): boolean {
    return !!this.getDefined();
  }

  static getDefined(): CustomElementConstructor {
    return customElements.get(this.elementTagName);
  }

  /**
   * No named slot element.
   */
  get _slot(): HTMLSlotElement {
    return this.shadowRoot.querySelector<HTMLSlotElement>("slot:not([name])");
  }

  /**
   * All slot elements.
   */
  get _slotAll(): HTMLSlotElement[] {
    return [...this.shadowRoot.querySelectorAll<HTMLSlotElement>("slot")];
  }

  /**
   * Slotted elements.
   */
  get _slottedAll(): HTMLElement[] {
    return [...this.querySelectorAll<HTMLSlotElement>("[slot]")];
  }

  /**
   * Named slotted elements' slot attribute.
   */
  get _slottedNames(): string[] {
    return this._slottedAll.map((c) => c.getAttribute("slot")).filter((v) => v);
  }

  events: Events;
  assign: void | Record<string, any>;

  /**
   * css: current stylex property.
   * index: index of injected style.
   * lazy: stylex property that will be applied after connectedCallback.
   */
  __stylex: { css?: string; index?: number; lazy?: string; };

  get stylex(): string | undefined {
    return this.__stylex.css;
  }

  /**
   * Appends to `shadowRoot.adoptedStyleSheets` and overrides the initial styles.
   *
   * If there is no selector, it will be `:host`.
   *
   * If element has no shadowRoot, it will be applied after connectedCallback.
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

  constructor(init?: Record<PropertyKey, any>) {
    super();
    this.events = new Events();
    this.__stylex = {};
    this.assign = {
      ...(GodownElement.godownConfig?.assign || {}),
      ...init,
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
      this.__stylex.lazy = "";
    }
  }

  disconnectedCallback() {
    this.events.removeAll();
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

  deepQuerySelector<E extends Element = HTMLElement>(selectors: string): E {
    return deepQuerySelector<E>(selectors, this);
  }

  deepQuerySelectorAll<E extends Element = HTMLElement>(selectors: string): E[] {
    return deepQuerySelectorAll<E>(selectors, this);
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

export { GodownElement, GodownElement as default };

export interface LikeString {
  toString(): string;
}

export type HandlerEvent<T = HTMLElement, E = Event> =
  & E
  & {
    target: T;
  }
  & Record<string, any>;
