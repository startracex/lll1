const defconf: conftype = {
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

export const conf: conftype = init(globalThis.GodownWebComponentsCONF, defconf);
export default conf;

export function init(CONFObject: conftype, source = conf) {
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
    GodownWebComponentsCONF: conftype;
  }
}
type conftype = {
  prefix?: string;
  suffix?: string;
  tag?: (origin: string) => string;
  enabled?: any[];
  namemap?: Map<string, string>;
  reflect?: boolean;
  cssvar?: string;
};
