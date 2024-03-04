import type GodownElement from "./godown-element";
import naming from "./naming.js";

const defaultConfig: ConfType = {
  assign: null,
  cssvar: "godown",
  classMap: new Map(),
  nameMap: new Map(),
  naming: "latest",
  reflect: false,
  prefix: "",
  suffix: "",
  tag(origin: string) {
    if (this.naming) {
      origin = naming[this.naming]?.get(origin) || origin;
    }
    return origin;
  },
  define(name: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions) {
    name ||= constructor.name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    const tagName = this.prefix + this.tag(name) + this.suffix;
    if (!tagName.includes("-") || customElements.get(name)) {
      return;
    }
    this.nameMap.set(name, tagName);
    (constructor as typeof GodownElement).elementTagName = tagName;
    conf.classMap.set(tagName, constructor);
    customElements.define(tagName, constructor, options);
  },
};

export const conf: ConfType = init(globalThis.GodownWebComponentsCONF, defaultConfig);

export function init(config: Partial<ConfType>, source: ConfType = conf): ConfType {
  Object.assign(source, config);
  if (source.reflect) {
    // Reflect to globalThis.
    globalThis.GodownWebComponentsCONF = source;
  } else {
    try {
      delete globalThis.GodownWebComponentsCONF;
    } catch (e) {
      /* empty */
    }
  }
  return source;
}

export function defineConfig(config: Parameters<typeof init>[0]): ConfType {
  return init(config, conf);
}

export default conf;

declare global {
  interface globalThis {
    GodownWebComponentsCONF: ConfType;
  }
  interface DocumentEventMap {
    "godown-define": DefineEvent;
  }
}

export interface ConfType {
  /**
   * When a {@linkcode GodownElement} element is created, assign to the element.
   */
  assign: null | Record<string, any>;
  /**
   * CSS variable prefix, without `--`.
   */
  cssvar: string;
  /**
   * Mapping of element names to constructors.
   */
  classMap: Accessor<string, CustomElementConstructor>;
  /**
   * Mapping of element names.
   */
  nameMap: Accessor<string, string>;
  naming: "" | keyof typeof naming;
  /**
   * Reflect to globalThis.
   */
  reflect: boolean;
  /**
   * Name prefix.
   */
  prefix: string;
  /**
   * Name suffix.
   */
  suffix: string;
  /**
   *
   * @param origin
   * @returns Name to define.
   * If the name is not in {@linkcode ConfType.nameMap},
   * the name is {@linkcode ConfType.prefix} + `origin` + {@linkcode ConfType.tag.suffix}.
   */
  tag: (origin: string) => string;
  /**
   * Define a Element.
   *
   * @param name Define name.
   * @param constructor Custom element constructor.
   * @param options Element definition options.
   */
  define: (name: string | void, constructor: CustomElementConstructor, options?: ElementDefinitionOptions) => void;
}

export interface DefineEvent {
  detail: {
    name: string;
    constructor: typeof GodownElement;
    options?: ElementDefinitionOptions;
  };
}

export interface GetSet<K, V> {
  get: (key: K) => V;
  set(key: K, value: V): void;
}

export type MixedRecord<K, V, M> = M | (K extends PropertyKey ? M & Record<K, V> : never);
export type SetAccessor<K = string, V = string | undefined> = MixedRecord<K, V, { set(key: K, value: V): void }>;
export type GetAccessor<K = string, V = string | undefined> = MixedRecord<K, V, { get: (key: K) => V }>;
export type Accessor<K = string, V = string | undefined> = GetAccessor<K, V> & SetAccessor<K, V>;
