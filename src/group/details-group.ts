import { css, property } from "../deps.js";
import { htmlSlot, type HTMLTemplate } from "../lib/templates.js";
import { define } from "../root.js";
import GroupSTD from "./std.js";

const defineName = "details-group";

@define(defineName)
export class DetailsGroup extends GroupSTD {
  /**
   * Default open element index.
   */
  @property({ type: Number }) index = -1;
  /**
   * If true, close the previous element when switching index.
   */
  @property({ type: Boolean }) only = false;

  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  protected render(): HTMLTemplate {
    return htmlSlot();
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.only) {
      this.addEvent(this, "click", this._handleClick);
    }
    this.children[this.index]?.setAttribute("open", "");
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.index = -1;
  }

  protected _handleClick(e: MouseEvent) {
    this.children[this.index]?.removeAttribute("open");
    this.index = this.assigned.indexOf(e.target as HTMLElement);
  }
}

export default DetailsGroup;

declare global {
  interface HTMLElementTagNameMap {
    "details-group": DetailsGroup;
  }
}
