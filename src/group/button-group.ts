import { css, define, html, property } from "../deps.js";
import STD from "./std.js";
@define("button-group")
export class ButtonGroup extends STD {
  @property({ type: Boolean }) v = false;
  static styles = css`
  :host{
    display: inline-flex;
    align-items: center;
  }
  .v{
    flex-direction: column;
  }
  .h ::slotted(*:nth-of-type(1)){
    border-top-right-radius:0 !important;
    border-bottom-right-radius:0 !important;
  }
  .h ::slotted(*:last-of-type){
    border-top-left-radius:0 !important;
    border-bottom-left-radius:0 !important;
  }
  .v ::slotted(*:nth-of-type(1)){
    border-bottom-left-radius:0 !important;
    border-bottom-right-radius:0 !important;
  }
  .v ::slotted(*:last-of-type){
    border-top-left-radius:0 !important;
    border-top-right-radius:0 !important;
  }
  .h ::slotted(*){
   margin:0 -.04em; /* 50% border-width */
  }
  .v ::slotted(*){
   margin: -.04em 0; /* 50% border-width */
  }
  ::slotted(*:hover){
    z-index:2
  }
  .h{
    margin:0 .04em;
    display: inherit;
  }
  .v{
    margin:.04em 0;
    display: inherit;
  }
  `;
  render() {
    return html`
    <slot name="pre"></slot>
    <div class=${this.v ? "v" : "h"}>
    <style>::slotted(*:nth-of-type(1)),::slotted(*:last-of-type){border-radius:${getComputedStyle(this).borderRadius}}</style>
    <slot></slot>
    </div>
    <slot name="suf"></slot>
    `;
  }
}
export default ButtonGroup;
declare global {
  interface HTMLElementTagNameMap {
    "button-group": ButtonGroup;
  }
}