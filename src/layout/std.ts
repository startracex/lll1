import { css, CSSResultGroup, cssvar, GodownElement } from "../deps.js";

export default class LayoutSTD extends GodownElement {
  static styles = [
    GodownElement.styles,
    css`
      :host {
        ${cssvar}--nav-text: rgb(240 240 240);
        ${cssvar}--nav-background: rgb(12 12 12);
        ${cssvar}--nav-super-background: rgb(16 136 138);
      }
    `,
  ] as CSSResultGroup;
}
