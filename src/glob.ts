import { css, type CSSResult, type CSSResultGroup, LitElement, unsafeCSS } from "lit";
import { deepQuerySelector, deepQuerySelectorAll } from "./lib/utils.js";
import { EventListenerFunc, EventsCollection } from "./lib/event-collection.js";
import { conf } from "./conf.js";
import type { LikeString } from "./with";

/**
 * Define a custom element.
 * @param name Name for the new custom element. Must be a valid custom element name.
 * @param options Object that controls how the element is defined.
 */
export const define = (name: string, options?: ElementDefinitionOptions) => (constructor: CustomElementConstructor) => {
  const tagName = conf.tag(name);
  if (!tagName) {
    return;
  }
  if (customElements.get(tagName) === undefined) {
    customElements.define(tagName, constructor, options);
    conf.enabled.add(name);
    conf.namemap.set(name, tagName);
    conf.classmap.set(name, constructor);
  }
};

/**
 * Custom CSS variable prefix, join with "--".
 */
export const cssvar = unsafeCSS("--" + conf.cssvar.replace(/[^a-zA-Z0-9\\-]/g, ""));

export function createScope(scope: LikeString): CSSResult {
  return unsafeCSS(`${cssvar}--${scope}`);
}

export const cssvarValues = {
  cssvar,
  input: createScope("input"),
  main: createScope("background"),
  text: createScope("foreground"),
  mainRGB: createScope("background-rgb"),
  textRGB: createScope("foreground-rgb"),
};

/**
 * Global element.
 */
export class GodownElement extends LitElement {
  static styles = [
    css`
      :host {
        ${cssvar}--background-rgb: 12 12 12;
        ${cssvar}--background: rgb(var(${cssvarValues.mainRGB}));
        ${cssvar}--foreground-rgb: 240 240 240;
        ${cssvar}--foreground: rgb(var(${cssvarValues.textRGB}));
        ${cssvar}--size: 100%;
        ${cssvar}--accept: rgb(25 130 180);
        font-size: var(${cssvar}--size);
      }
    `,
    css`
      :host {
        ${cssvarValues.input}--width: 10.6rem;
        ${cssvarValues.input}--height: 1.6em;
        ${cssvarValues.input}--background: var(${cssvarValues.main});
        ${cssvarValues.input}--true: rgb(48 132 240);
        ${cssvarValues.input}--false: rgb(198 198 198);
        ${cssvarValues.input}--control: var(${cssvar}--text);
        ${cssvarValues.input}--control-edge: var(${cssvarValues.input}--true);
        ${cssvarValues.input}--outline-color: var(${cssvar}--accept);
        ${cssvarValues.input}--outline-width: .15em;
        ${cssvarValues.input}--outline-style: solid;
        ${cssvarValues.input}--outline: var(${cssvarValues.input}--outline-width)  var(${cssvarValues.input}--outline-style) var(${cssvarValues.input}--outline-color);
        ${cssvarValues.input}--radius: 0.2em;
      }
    `,
    css`
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
        ${cssvar}--text-selection--color: inherit;
        ${cssvar}--text-selection--background: none;
        color: var(${cssvar}--text-selection--color);
        background: var(${cssvar}--text-selection--background);
      }
    `,
  ] as CSSResultGroup;

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

  /**
   * Assign to {@linkcode GodownElement}
   * @param assign Assign value
   */
  constructor(assign: void | (Record<string, any> & { classList?: DOMTokenList | string[] }) = conf.assign) {
    super();
    this.__events = new EventsCollection();
    if (assign) {
      const classList = "classList";
      if (classList in assign) {
        assign[classList] = [...this[classList], ...assign[classList]];
      }
      Object.assign(this, assign);
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

GodownElement.disableWarning?.("change-in-update");
