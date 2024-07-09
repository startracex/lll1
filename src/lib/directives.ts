import { html, nothing, svg } from "lit";
export type HTMLTemplate = ReturnType<typeof html> | ReturnType<typeof html>[];

interface RenderIf {
  <A, B>(value: unknown, a: A, b: B): A | B;
  <A>(value: unknown, a: A): A;
}
/**
 *
 * @param value Condition.
 * @param a Return  when the condition is true.
 * @param b Return  when the condition is false.
 * @returns a || b || nothing
 */
export const ifValue: RenderIf = <A, B>(value: unknown, a: A, b?: B) => {
  return (value && a) || b || nothing;
};

export const combine = (map: Record<string, any>, init = "", join = " ") => {
  return Object.entries(map).reduce((acc, [key, value]) => {
    if (value) {
      acc += acc ? join + key : key;
    }
    return acc;
  }, init);
};

export const htmlSlot = (name?: string) => {
  return name ? html`<slot name="${name}" part="slot-${name}"></slot>` : html`<slot></slot>`;
};

export const htmlStyle = (style?: string) => {
  return ifValue(
    style,
    html`<style>
      ${style}
    </style>`,
  );
};

/**
 * @param fill undefined: "currentColor". zero value: "none".
 * @param stroke undefined: "currentColor". zero value: "none".
 * @returns Function returns path needs d.
 */
export const path = (
  fill: string | void | number = "currentColor",
  stroke: string | void | number = "currentColor",
  strokeWidth: string | void | number = 3,
) => {
  fill = fill || "none";
  stroke = stroke || "none";
  return (d: string) => {
    return svg`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"></path>`;
  };
};
