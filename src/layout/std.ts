import { css, cssvar, GLOBSTD } from "../deps.js";
export default class LayoutSTD extends GLOBSTD {}
export const navstyle = css`
  :host {
    ${cssvar}--nav-text: rgb(240 240 240);
    ${cssvar}--nav-background: rgb(28 28 30);
    ${cssvar}--nav-super-background: rgb(16 136 138);
  }
`;
