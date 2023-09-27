import { html, css, property, define, state, query } from "../deps.js";
import STD, { DLsharecss } from "./std.js";
@define("menu-list")
export class MenuList extends STD {
  @property() summary = "";
  @property({ type: Boolean, reflect: true }) open = false;
  @state() def: boolean;
  @query("section") _section: HTMLElement;
  static styles = [STD.styles, DLsharecss, css`
  i{
    width: 1.2em;
    height: 1.2em;
    display: inline-flex;
    align-items: center;
    border-radius: 20%;
    transition:inherit;
  }
  dt i{
    background-color: rgb(0 0 0 / 0.055);
  }
  dt i:hover{
    background-color: rgb(0 0 0 /.075);
  }
  [open] svg{
    transform: rotate(90deg);
  }
  [notitle]{
    display: none;
  }
  `];
  render() {
    const notitle = !this.summary && !this.querySelector(`[slot="summary"]`);
    if (notitle) {
      this.open = true;
    }
    return html`<dl>
<dt ?open=${this.open} ?notitle=${notitle} >
  <span>${this.summary}<slot name="summary"></slot></span>
  <i @click=${() => this.toggle()}>${!this.querySelector(`[slot="icon"]`) ? html`<svg viewBox="0 0 48 48" fill="none"><path d="M19 12L31 24L19 36" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>` : html`<slot name="icon"></slot>`}</i>
</dt>
<dd ?open=${this.open}>
  <section><slot></slot></section>
</dd></dl>`;
  }
  toggle(to = !this.open) {
    this.open = to;
    this.dispatchEvent(new CustomEvent("change", { detail: this.open }));
  }

}
export default MenuList;
declare global {
  interface HTMLElementTagNameMap {
    "menu-list": MenuList;
  }
}