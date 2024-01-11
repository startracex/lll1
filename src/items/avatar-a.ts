import { css, cssvar, define, html, ifDefined, property } from "../deps.js";
import { htmlSlot, type HTMLTemplate } from "../tmpl.js";
import ItemsSTD from "./std.js";

@define("avatar-a")
export class AvatarAnchor extends ItemsSTD {
  static styles = css`
    :host {
      ${cssvar}--ava: 1.5em;
      display: inline-flex;
    }

    * {
      border-radius: inherit;
    }

    img {
      width: 100%;
      height: 100%;
    }

    a {
      height: var(${cssvar}--ava);
      width: var(${cssvar}--ava);
      color: inherit;
      display: flex;
      position: relative;
      align-items: inherit;
    }

    span {
      position: absolute;
      width: 100%;
      text-align: center;
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
  @property() src: string | undefined | null = "";
  @property() def: string = undefined;
  @property() href = undefined;
  @property() name = "";
  @property({ type: Number }) more = 0;

  protected render(): HTMLTemplate {
    return html`
      <a href="${ifDefined(this.href)}"> ${this.renderAva()} ${htmlSlot("mask")} </a>
      ${htmlSlot()}
    `;
  }

  private renderAva(): HTMLTemplate {
    if (this.more) {
      const more = this.more > 99 ? "..." : this.more;
      return html`<span>+${more}</span>`;
    }
    if (this.src) {
      return html`<img src="${this.src}" @error=${this.imgOnError} alt="" />`;
    }
    if (this.name) {
      let name = this.name.slice(0, 2);
      name = name[0].toUpperCase() + name.slice(1);
      return html`<span>${name}</span>`;
    }
    return html`<slot name="avatar"></slot>`;
  }

  imgOnError(e: ErrorEvent) {
    if (this.def) {
      (e.target as HTMLImageElement).src = this.def;
    } else {
      this.src = undefined;
    }
  }
}

export default AvatarAnchor;
declare global {
  interface HTMLElementTagNameMap {
    "avatar-a": AvatarAnchor;
  }
}
