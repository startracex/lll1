import { css, html, property } from "../../deps.js";
import { ifValue } from "../../lib/directives.js";
import { htmlSlot, htmlStyle, type HTMLTemplate } from "../../lib/templates.js";
import { append } from "../../lib/utils.js";
import { define, GodownElement } from "../../root.js";
import AvatarA from "../a/avatar-a.js";

const defineName = "avatar-group";

/**
 * AvatarGroup ensure that the display content does not exceed the maximum value, and display the excess quantity.
 */
@define(defineName)
export class AvatarGroup extends GodownElement {
  /**
   * The maximum number of elements that can be accepted for this element.
   */
  @property({ type: Number }) max = 99;
  /**
   * When the content overflows, create an {@linkcode AvatarA} with the same {@linkcode AvatarA.more} attribute as more.
   */
  @property({ type: Number }) more = 0;

  static styles = [
    css`
      :host {
        display: flex;
        width: 100%;
        height: 100%;
      }

      div {
        display: contents;
      }
    `,
  ];

  protected render(): HTMLTemplate {
    const cssStr = `slot::slotted(:nth-of-type(n + ${(this.max || 0) + 1})) {display: none;}`;
    return html`${htmlSlot()} ${htmlStyle(cssStr)} ${ifValue(this.more > 0, new AvatarA({ more: this.more }))}`;
  }

  protected firstUpdated() {
    if (!this.more && this.assigned.length > this.max) {
      this.more = this.assigned.length - this.max;
    }
  }

  append(args = new AvatarA()) {
    if (this.max && this.assigned.length === this.max) {
      this.assigned.pop().style.display = "none";
      append(this, args);
      this.assigned.pop().style.display = "none";
      this.more = 2;
    } else if (this.max && this.assigned.length > this.max) {
      append(this, args);
      this.assigned.pop().style.display = "none";
      this.more += 1;
    } else {
      append(this, args);
    }
  }

  subtract() {
    if (this.more === 2) {
      this.assigned.pop().style.display = "";
      this.more = 0;
      return;
    } else if (this.more > 0) {
      this.more -= 1;
    }
    if (this.assigned.length) {
      this.assigned.pop().remove();
    }
  }
}

export default AvatarGroup;

declare global {
  interface HTMLElementTagNameMap {
    "avatar-group": AvatarGroup;
  }
}
