import { css, define, html, property } from "../deps.js";
import STD from "./std.js";
@define("details-group")
export class DetailsGroup extends STD {
  @property({ type: Number }) index = -1;
  @property({ type: Boolean }) only = false;
  static styles = css`
    :host {
      display: block;
    }
  `;
  render() {
    return html`<slot></slot>`;
  }
  get assigned() {
    return this.shadowRoot.querySelector("slot").assignedElements();
  }
  async firstUpdated() {
    await this.updateComplete;
    if (this.index >= 0) {
      this.assigned[this.index]?.setAttribute("open", "");
    }
    this.addEventListener("click", this._handleClick);
  }
  _handleClick(e) {
    if (this.only) {
      this.index = this.assigned.indexOf(e.target);
      this.assigned.forEach((e, i) => {
        if (i != this.index) {
          e.removeAttribute("open");
        }
      });
    }
  }
}
export default DetailsGroup;
declare global {
  interface HTMLElementTagNameMap {
    "details-group": DetailsGroup;
  }
}
