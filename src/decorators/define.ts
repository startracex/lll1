import conf from "../conf.js";
import type GodownElement from "../godown-element.js";

/**
 * Define a custom element.
 * @param name Name for the new custom element.
 */
export const define =
  (name?: string, options?: any) =>
  //
  (constructor: CustomElementConstructor | typeof GodownElement) => {
    conf.define(name, constructor, options);
  };
