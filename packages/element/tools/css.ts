import { type CSSResult } from "lit";

import { isNil } from "./lib.js";

/**
 * Call Object.values and join "".
 */
export function constructCSS<K extends string, V extends string | number | CSSResult>(
  vars: string[],
  props: Record<K, V[]>,
  selectorFunc?: (raw: string) => string,
  propertyFunc?: (raw: V) => any,
): string {
  return Object.values(constructCSSObject(vars, props, selectorFunc, propertyFunc)).join("");
}

/**
 * Create a CSS style object based on the provided variable name array and property object.
 * @param vars - Variable name array.
 * @param props - Property object containing style values for each variable.
 * @param selectorFunc Function to process selector.
 * @param propertyFunc Function to process property.
 * @return CSS style object with selectors as keys and corresponding styles as values.
 */
export function constructCSSObject<
  K extends string,
  V extends string | number | CSSResult,
  R extends Record<K, string>,
>(
  vars: string[],
  props: Record<K, V[]>,
  selectorFunc?: (raw: string) => string,
  propertyFunc?: (raw: V) => any,
): R {
  const cssObject = {} as R;
  Object.keys(props).forEach((sel) => {
    const rules = vars.reduce((acc: string[], key, index) => {
      let value = props[sel][index] as V;
      value = (propertyFunc ? propertyFunc(value) : value) as V;
      if (!isNil(value)) {
        acc.push(`${key}:${value}`);
      }
      return acc;
    }, []);
    cssObject[sel] = `${selectorFunc ? selectorFunc(sel) : sel}{${rules.join(";")}}`;
  });
  return cssObject;
}

type Props = Record<
  string,
  string | number | {
    toString(): string;
  }
>;

export function joinRules(rules: Record<string, string | Props>): string {
  return Object.keys(rules).reduce((css, key) => {
    const value = rules[key];
    if (!value) {
      return css;
    }
    const properties = (typeof value === "string") ? value : joinProperties(value);
    return properties ? css + `${key}{${properties}}` : css;
  }, "");
}

export function joinProperties(props: Props): string {
  return Object.keys(props).reduce((css, key) => {
    const value = props[key];
    return isNil(value) ? css : css + `${key}:${value};`;
  }, "");
}
