import type GodownElement from "./godown-element";
const defaultConfig: ConfType = {
  assign: null,
  cssvar: "godown",
  namemap: new Map(),
  classmap: new Map(),
  prefix: "",
  reflect: false,
  suffix: "",
  tag(origin: string) {
    return this.prefix + origin + this.suffix;
  },
  define(name: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions) {
    const tagName: string = this.tag(name);
    if (!tagName) {
      return;
    }
    if (!customElements.get(tagName)) {
      customElements.define(tagName, constructor, options);
      (constructor as typeof GodownElement).elementTagName = tagName;
      this.namemap.set(name, tagName);
      this.classmap.set(name, constructor);
    }
  },
};

export const conf: ConfType = init(globalThis.GodownWebComponentsCONF, defaultConfig);
export default conf;

export function init(CONFObject: Partial<ConfType>, source: ConfType = conf): ConfType {
  Object.assign(source, CONFObject);
  if (source.reflect) {
    // Reflect conf to globalThis
    globalThis.GodownWebComponentsCONF = source;
  } else {
    delete globalThis.GodownWebComponentsCONF;
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
  assign: null | Record<string, any>;
  cssvar: string;
  namemap: Map<string, string>;
  classmap: Map<string, CustomElementConstructor>;
  prefix: string;
  reflect: boolean;
  suffix: string;
  tag: (origin: string) => string;
  define: CustomElementRegistry["define"];
}
