import { notNil } from "./utils.js";

/**
 * Call Object.values and join "".
 */
export function constructCSS(
  vars: string[],
  props: Record<string, (string | number)[]>,
  selectorFunc?: (raw: string) => string,
): string {
  return Object.values(constructCSSObject(vars, props, selectorFunc)).join("");
}

/**
 * Create a CSS style object based on the provided variable name array and property object
 * @param vars - Variable name array
 * @param props - Property object containing style values for each variable
 * @param selectorFunc (Optional) Function to process selector names
 * @return CSS style object with selectors as keys and corresponding styles as values
 */
export function constructCSSObject<K extends string, V = string | number, R = Record<K, string>>(
  vars: string[],
  props: Record<K, V[]>,
  selectorFunc?: (raw: string) => string,
): R {
  const cssObject = {} as R;
  Object.keys(props).forEach((sel) => {
    const rules = vars.reduce((acc: string[], key, index) => {
      const value = props[sel][index] as V;
      if (notNil(value)) {
        acc.push(`${key}:${value}`);
      }
      return acc;
    }, []);
    cssObject[sel] = `${selectorFunc ? selectorFunc(sel) : sel}{${rules.join(";")}}`;
  });
  return cssObject;
}
