import { append, css, define, html, property } from "../deps.js";
import STD from "./std.js";
@define("avatar-group")
export class AvatarGroup extends STD {
  @property({ type: Boolean }) rank = false;
  @property({ type: Number }) max = 0;
  @property({ type: Number }) more = 0;
  @property({ attribute: false }) usefresh: () => Promise<void> = async () => {
    await this.updateComplete;
    this.scrollTop = this.scrollHeight;
  };
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }
    div {
      display: contents;
    }
    .flex {
      display: flex;
      flex-direction: row;
    }
  `;
  get assigned() {
    return this.shadowRoot.querySelector("slot").assignedElements() as HTMLElement[];
  }
  render() {
    const cssstr = `slot::slotted(:nth-of-type(n + ${(this.max || 0) + 1})) {display: none;}`;
    return html`
      ${this.rank
        ? html`<div class="flex">
            <slot></slot>
            <style>
              ${cssstr}
            </style>
            <avatar-anchor style="display:${this.more > 0 ? undefined : "none"}" more=${this.more || 0}></avatar-anchor>
          </div>`
        : html`<div><slot></slot></div>`}
    `;
  }
  firstUpdated() {
    if (this.rank && !this.more) {
      let more = 0;
      if (this.max && this.assigned.length > this.max) {
        more = this.assigned.length - this.max;
      }
      this.more = more;
    }
  }
  append(args = "avatar-anchor") {
    if (this.max && this.assigned.length == this.max) {
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
    this.fresh();
  }
  subtract() {
    if (this.more == 2) {
      this.assigned.pop().style.display = "";
      this.more = 0;
      return;
    } else if (this.more > 0) {
      this.more -= 1;
    }
    if (this.assigned.length) this.assigned.pop().remove();
  }
  async fresh() {
    await this.usefresh();
  }
}
export default AvatarGroup;
declare global {
  interface HTMLElementTagNameMap {
    "avatar-group": AvatarGroup;
  }
}
