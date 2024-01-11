import { css, define, property } from "../deps.js";
import { htmlSlot, type HTMLTemplate } from "../tmpl.js";
import GroupSTD from "./std.js";

@define("details-group")
export class DetailsGroup extends GroupSTD {
  @property({ type: Number }) index = -1;
  @property({ type: Boolean }) only = false;
  static styles = css`
    :host {
      display: block;
    }
  `;

  protected render(): HTMLTemplate {
    return htmlSlot();
  }

  protected async firstUpdated() {
    await this.updateComplete;
    if (this.index >= 0) {
      this.assigned[this.index]?.setAttribute("open", "");
    }
    this.addEvent(this, "click", this._handleClick);
  }

  protected _handleClick(e: MouseEvent) {
    if (this.only) {
      this.index = this.assigned.indexOf(e.target as HTMLElement);
      this.assigned.forEach((e, i) => {
        if (i !== this.index) {
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
