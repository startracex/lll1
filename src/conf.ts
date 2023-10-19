const defconf: ConfType = {
  prefix: "",
  suffix: "",
  tag(origin) {
    return this.prefix + origin + this.suffix;
  },
  enabled: [],
  namemap: new Map(),
  reflect: false,
  cssvar: "godown-c",
};

export const conf: ConfType = init(globalThis.GodownWebComponentsCONF, defconf);
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
  prefix: string;
  suffix: string;
  tag: (origin: string) => string;
  enabled: string[];
  namemap: Map<string, string>;
  reflect: boolean;
  cssvar: string;
}
