import { css, cssvar, define, html, ifDefined, property } from "../deps.js";
import { htmlSlot } from "../tmpl.js";
import ItemsSTD from "./std.js";

@define("avatar-a")
export class AvatarA extends ItemsSTD {
  static styles = css`
    :host {
      height: fit-content;
      ${cssvar}--ava: 2em;
      display: inline-flex;
      align-items: center;
    }

    * {
      border-radius: inherit;
    }

    img {
      width: 100%;
      height: 100%;
    }

    a {
      color: inherit;
      height: var(${cssvar}--ava);
      width: var(${cssvar}--ava);
      min-height: var(${cssvar}--ava);
      min-width: var(${cssvar}--ava);
      display: flex;
      position: relative;
    }

    span {
      position: absolute;
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    slot[name="mask"] {
      position: absolute;
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
    }
  `;
  @property() src = "";
  @property() href = undefined;
  @property() name = "";
  @property({ type: Number }) more = 0;

  render() {
    return html`
      <a href="${ifDefined(this.href)}"> ${this.render_ava()} ${htmlSlot("mask")} </a>
      ${htmlSlot()}
    `;
  }

  render_ava() {
    if (this.more) {
      const more = this.more > 99 ? "..." : this.more;
      return html`<span>+${more}</span>`;
    }
    if (this.src) {
      return html`<img src="${this.src}" alt="${this.name}" />`;
    }
    if (this.name) {
      let name = this.name.slice(0, 2);
      name = name[0].toUpperCase() + name.slice(1);
      return html`<span>${name}</span>`;
    }
    return html`<slot name="avatar"></slot>`;
  }
}

export default AvatarA;
declare global {
  interface HTMLElementTagNameMap {
    "avatar-a": AvatarA;
  }
}
