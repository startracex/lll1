import { css, CSSResultGroup, cssvar, GlobalSTD } from "../deps.js";

export default class LayoutSTD extends GlobalSTD {
  static styles = [
    GlobalSTD.styles,
    css`
      :host {
        ${cssvar}--nav-text: rgb(240 240 240);
        ${cssvar}--nav-background: rgb(12 12 12);
        ${cssvar}--nav-super-background: rgb(16 136 138);
      }
    `,
  ] as CSSResultGroup;
}
