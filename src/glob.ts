import { conf } from "./conf.js";
import { CSSResultGroup, LitElement, css, unsafeCSS } from "lit";
/** 
 * Custom CSS variable,join with "--" ,only allow `a-Z,0-9,-`
 */
export const cssvar = unsafeCSS("--" + conf.cssvar.replace(/[^a-zA-Z0-9\-]/g, ""));
export class GLOBSTD extends LitElement {
  static styles = css`
  :host{
    ${cssvar}--text-selection: rgb(80 255 255);
    ${cssvar}--text-selection-background: rgb(0 0 0 / 10%);
  }
  *{
    font-size:100%;
    color:inherit;
    box-sizing:border-box;
    margin:0;
    padding:0;
  }
  ::selection{
    color: var(${cssvar}--text-selection);
    background: var(${cssvar}--text-selection-background);
  }` as CSSResultGroup;
}