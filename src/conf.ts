import type GodownElement from "./godown-element";

const defaultConfig: ConfType = {
  assign: null,
  cssvar: "godown",
  classMap: new Map(),
  nameMap: new Map(),
  reflect: false,
  prefix: "",
  suffix: "",
  tag(origin: string) {
    const name = this.nameMap.get(origin) || origin;
    return this.prefix + name + this.suffix;
  },
  define(name: string | void, constructor: CustomElementConstructor, options?: ElementDefinitionOptions) {
    if (!name) {
      name = constructor.name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    }
    const tagName = this.tag(name);
    if (!customElements.get(tagName)) {
      customElements.define(tagName, constructor, options);
      (constructor as typeof GodownElement).elementTagName = tagName;
      this.nameMap.set(name, tagName);
      this.classMap.set(tagName, constructor);
    }
  },
};

export const conf: ConfType = init(globalThis.GodownWebComponentsCONF, defaultConfig);
export default conf;

export function init(CONFObject: Partial<ConfType>, source: ConfType = conf): ConfType {
  Object.assign(source, CONFObject);
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

export function defineConfig(CONFObject: Partial<ConfType>): ConfType {
  return init(CONFObject, conf);
}

declare global {
  interface globalThis {
    GodownWebComponentsCONF: ConfType;
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

export interface GetSet<K, V> {
  get: (key: K) => V;
  set(key: K, value: V): void;
}

export type Accessor<K, V> = GetSet<K, V> | (K extends PropertyKey ? GetSet<K, V> & Record<K, V> : never);
