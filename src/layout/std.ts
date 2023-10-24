import { css, cssvar, GlobalSTD } from "../deps.js";

export default class LayoutSTD extends GlobalSTD {}
export const navStyle = css`
  :host {
    ${cssvar}--nav-text: rgb(240 240 240);
    ${cssvar}--nav-background: rgb(28 28 30);
    ${cssvar}--nav-super-background: rgb(16 136 138);
  }
`;
