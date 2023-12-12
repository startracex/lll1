import { css, CSSResultGroup, define, html, property, query, state } from "../deps.js";
import { htmlSlot, svgArrow } from "../tmpl.js";
import { OpenAble } from "./std.js";

@define("menu-list")
export class MenuList extends OpenAble {
  @property() summary = "";
  @state() def: boolean;
  @query("section") _section: HTMLElement;
  static styles = [
    OpenAble.styles,
    css`
      i {
        width: 1.2em;
        height: 1.2em;
        display: inline-flex;
        align-items: center;
        border-radius: 20%;
        transition: inherit;
      }

      dt i {
        background-color: rgb(0 0 0 / 0.055);
      }

      dt i:hover {
        background-color: rgb(0 0 0 /0.075);
      }

      :host([open]) svg {
        transform: rotate(90deg);
      }

      .noTitle {
        display: none;
      }
    `,
  ] as CSSResultGroup[];

  render() {
    const noTitle = !this.summary && !this.querySelector("[slot=summary]") ? "noTitle" : "";
    if (noTitle) {
      this.open = true;
    }
    return html`<dl>
      <dt class="${noTitle}">
        <span>${this.summary}${htmlSlot("summary")}</span>
        <i @click="${this._handelClick}"> ${this.render_icon()} </i>
      </dt>
      <dd>
        <section>${htmlSlot()}</section>
      </dd>
    </dl>`;
  }

  private render_icon() {
    if (this.querySelector("[slot=icon]")) {
      return htmlSlot("icon");
    }
    return svgArrow();
  }
}

export default MenuList;
declare global {
  interface HTMLElementTagNameMap {
    "menu-list": MenuList;
  }
}
