import { css, property, state } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { ifValue } from "../../lib/directives.js";
import { htmlSlot } from "../../lib/directives.js";
import { htmlStyle } from "../../lib/directives.js";
import { GodownElement } from "../../proto/godown-element.js";
import Avatar from "./avatar.js";

const protoName = "avatar-group";

/**
 * {@linkcode AvatarGroup} used to limit the number of subcomponents.
 */
@godown(protoName)
@styles([
  css`
    :host {
      display: flex;
      width: 100%;
    }
  `,
])
export class AvatarGroup extends GodownElement {
  /**
   * Maximum number of child elements acceptable.
   */
  @property({ type: Number }) max = 99;

  /**
   * Exceeded quantity.
   */
  @state() more = 0;

  protected render() {
    return [
      htmlSlot(),
      ifValue(this.more > 0, [
        htmlStyle(`slot::slotted(:nth-of-type(n+${this.max})){display: none;}`),
        new Avatar({ innerText: `+${this.more}` }),
      ]),
    ];
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.children.length > this.max) {
      this.more = this.children.length - this.max;
    }
  }

  push(a: Avatar) {
    if (this.assigned.length === this.max) {
      this.more = 2;
    } else {
      this.more += 1;
    }
    this.appendChild(a);
  }

  pop() {
    if (this.assigned.length) {
      this.assigned.pop().remove();
      if (this.more === 2) {
        this.more = 0;
      } else {
        this.more -= 1;
      }
    }
  }
}

export default AvatarGroup;

// declare global {
//   interface HTMLElementTagNameMap {
//     ["godown-avatar-group"]: AvatarGroup;
//   }
// }
