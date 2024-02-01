import { nothing } from "lit";

type Nothing = typeof nothing;

interface RenderIf {
  <A, B>(value: boolean, a: A, b: B): A | B | Nothing;
  <A>(value: boolean, a: A): A | Nothing;
}

export const ifValue: RenderIf = <A, B>(value: boolean, a: A, b?: B) => {
  return (value && a) || b || nothing;
};

/**
 *
 * @param value Keys.
 * @param cases Match key and return value.
 * @param defaultCase Default.
 * @example
 * ```ts
 * for (const [key, value] of Object.entries(obj)){
 * choose(
 *    keys,
 *    [
 *      [
 *        "type", `${value} type.`,
 *      ],
 *      ["target"],
 *    ],
 *    `${key}: ${value}.`,
 *  )
 * }
 * ```
 */
export const choose = <T, V, K extends T = T>(value: T, cases: [K, V?][], defaultCase?: V) => {
  for (const c of cases) {
    if (!c.length) {
      continue;
    }
    const caseValue = c[0];
    if (value && caseValue === value) {
      return c[1];
    }
  }
  return defaultCase;
};
