const defaultConfig: ConfType = {
  cssvar: "godown",
  enabled: new Set<string>(),
  namemap: new Map<string, string>(),
  prefix: "",
  reflect: false,
  suffix: "",
  tag(origin) {
    return this.prefix + origin + this.suffix;
  },
};

export const conf: ConfType = init(globalThis.GodownWebComponentsCONF, defaultConfig);
export default conf;

export function init(CONFObject: Partial<ConfType>, source: ConfType = conf) {
  Object.assign(source, CONFObject);
  if (source.reflect) {
    // Reflect conf to globalThis
    globalThis.GodownWebComponentsCONF = source;
  } else {
    delete globalThis.GodownWebComponentsCONF;
  }
  return source;
}

declare global {
  interface globalThis {
    GodownWebComponentsCONF: ConfType;
  }
}

interface ConfType {
  cssvar: string;
  enabled: Set<string>;
  namemap: Map<string, string>;
  prefix: string;
  reflect: boolean;
  suffix: string;
  tag: (origin: string) => string;
}
