import { css, type CSSResultGroup, html, query } from "../deps.js";
import { cssvarValues, define } from "../root.js";
import { htmlSlot, type HTMLTemplate, svgArrow } from "../lib/templates.js";
import { ifValue } from "../lib/directives.js";
import { OpenAble } from "./std.js";

const defineName = "menu-list";

/**
 * MenuList renders the menu when it has a summary, otherwise a list.
 *
 * Inspired by Docusaurus (v1,v2).
 */
@define(defineName)
export class MenuList extends OpenAble {
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
        background: rgb(var(${cssvarValues.mainRGB}) / 0.055);
      }

      dt i:hover {
        background: rgb(var(${cssvarValues.mainRGB}) / 0.075);
      }

      dd {
        padding: 0.2em;
      }

      :host([open]) svg {
        transform: rotate(90deg);
      }

      .noTitle {
        display: none;
      }
    `,
  ] as CSSResultGroup;

  protected render(): HTMLTemplate {
    const noTitle = !this.summary && ifValue(!this.querySelector("[slot=summary]"), "noTitle");
    if (noTitle) {
      this.open = true;
    }
    return html`<dl>
      <dt class="${noTitle}">
        <span>${this.summary || htmlSlot("summary")}</span>
        <i @click="${this._handelClick}"> ${htmlSlot("icon", svgArrow(), this)} </i>
      </dt>
      <dd>
        <section>${htmlSlot()}</section>
      </dd>
    </dl>`;
  }
}

export default MenuList;

declare global {
  interface HTMLElementTagNameMap {
    "menu-list": MenuList;
  }
}
