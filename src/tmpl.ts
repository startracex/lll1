import { html, svg } from "lit";

export type HtmlTemplate = ReturnType<typeof html>;

/**
 * @param fill undefined: "currentColor". 0, null, "": "none"
 * @param stroke undefined: "currentColor". 0, null, "": "none"
 * @returns path
 */
export const path = (fill: string | undefined | null | 0 = "currentColor", stroke: string | undefined | null | 0 = "currentColor") => {
  fill = fill || "none";
  stroke = stroke || "none";
  return (d: string) => {
    return svg`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>`;
  };
};

interface HtmlSlot {
  (name?: "pre" | "suf"): HtmlTemplate;

  (name?: string): HtmlTemplate;
}

export const htmlSlot: HtmlSlot = (name?: string) => {
  if (name) {
    return html`<slot name="${name}"></slot>`;
  }
  return html`<slot></slot>`;
};

export const htmlStyle = (css: string) => {
  if (css) {
    return html`<style>
      ${css}
    </style>`;
  }
};

export const svgDelta = () => {
  return html`<svg viewBox="0 0 48 48" fill="none">${path()("M36 19L24 31L12 19H36Z")}</svg>`;
};

export const svgDeltaSmooth = () => {
  return html`<svg viewBox="0 0 16 16" fill="currentColor">${path(undefined, 0)("m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z")}</svg>`;
};

export const svgArrow = (body?: boolean) => {
  const d = body ? "M24 12L36 24L24 36" : "M19 12L31 24L19 36";
  return html`<svg viewBox="0 0 48 48" fill="none">${body && path()("M36 24.0083H12")} ${path("none")(d)}</svg>`;
};

export const svgSearch = () => {
  return html`<svg viewBox="0 0 1024 1024">${path()("M745.429333 655.658667c1.173333 0.746667 2.325333 1.578667 3.413334 2.496l114.410666 96a32 32 0 0 1-41.152 49.024l-114.389333-96a32 32 0 0 1-6.208-6.976A297.429333 297.429333 0 0 1 512 768c-164.949333 0-298.666667-133.717333-298.666667-298.666667S347.050667 170.666667 512 170.666667s298.666667 133.717333 298.666667 298.666666a297.386667 297.386667 0 0 1-65.237334 186.325334zM512 704c129.6 0 234.666667-105.066667 234.666667-234.666667s-105.066667-234.666667-234.666667-234.666666-234.666667 105.066667-234.666667 234.666666 105.066667 234.666667 234.666667 234.666667z")}</svg>`;
};

export const svgEye = () => {
  return html`<svg viewBox="0 0 48 48">${path(0)("M9.85786 18C6.23858 21 4 24 4 24C4 24 12.9543 36 24 36C25.3699 36 26.7076 35.8154 28 35.4921M20.0318 12.5C21.3144 12.1816 22.6414 12 24 12C35.0457 12 44 24 44 24C44 24 41.7614 27 38.1421 30")} ${path(0)("M20.3142 20.6211C19.4981 21.5109 19 22.6972 19 23.9998C19 26.7612 21.2386 28.9998 24 28.9998C25.3627 28.9998 26.5981 28.4546 27.5 27.5705")} ${path()("M42 42L6 6")}</svg>`;
};

export const svgX = () => {
  return html`<svg viewBox="0 0 48 48" fill="none">${path()("M14 14L34 34")} ${path()("M14 34L34 14")}</svg>`;
};

export const svgImage = () => {
  return html` <svg viewBox="0 0 1098 1024">${path(undefined, 0)("M365.714286 329.142857q0 45.714286-32.036571 77.677714t-77.677714 32.036571-77.677714-32.036571-32.036571-77.677714 32.036571-77.677714 77.677714-32.036571 77.677714 32.036571 32.036571 77.677714zM950.857143 548.571429l0 256-804.571429 0 0-109.714286 182.857143-182.857143 91.428571 91.428571 292.571429-292.571429zM1005.714286 146.285714l-914.285714 0q-7.460571 0-12.873143 5.412571t-5.412571 12.873143l0 694.857143q0 7.460571 5.412571 12.873143t12.873143 5.412571l914.285714 0q7.460571 0 12.873143-5.412571t5.412571-12.873143l0-694.857143q0-7.460571-5.412571-12.873143t-12.873143-5.412571zM1097.142857 164.571429l0 694.857143q0 37.741714-26.843429 64.585143t-64.585143 26.843429l-914.285714 0q-37.741714 0-64.585143-26.843429t-26.843429-64.585143l0-694.857143q0-37.741714 26.843429-64.585143t64.585143-26.843429l914.285714 0q37.741714 0 64.585143 26.843429t26.843429 64.585143z")}</svg>`;
};
