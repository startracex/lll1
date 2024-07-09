import conf from "../conf.js";
import type GodownElement from "../proto/godown-element.js";

export const godown = (name?: string) => (constructor: typeof GodownElement) => {
  name ||= constructor.name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  constructor.protoName = name;
  constructor.godownConfig = conf;
  constructor.elementTagName = conf.tag(name);
};

export default godown;
