import { css, type CSSResultGroup, define, html, property, query } from "../deps.js";
import { htmlSlot, type HTMLTemplate, svgDeltaSmooth } from "../tmpl.js";
import { OpenAble } from "./std.js";

const defineName = "details-expand";

@define(defineName)
export class DetailsExpand extends OpenAble {
  @property() summary = "";
  @property({ type: Boolean }) fill = false;
  @property({ type: Boolean }) reverse = false;
  @query("dd") _dd: HTMLDataListElement;
  static styles = [
    OpenAble.styles,
    css`
      dt {
        height: 100%;
      }

      i {
        height: 1.2em;
        min-width: 1.2em;
        aspect-ratio: 1/1;
        display: flex;
        margin-left: auto;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }

      :host([open]) i {
        transform: rotate(-90deg) !important;
      }
    `,
  ] as CSSResultGroup;

  protected render(): HTMLTemplate {
    return html`<dl>
      <dt @click="${this._handelClick}" style="flex-direction:row${this.reverse ? "-reverse" : ""}">
        <span> ${this.summary || htmlSlot("summary")} </span>
        <i style="transform: rotate(${this.reverse ? "-18" : ""}0deg);"> ${this.renderIcon()} </i>
      </dt>
      <dd>
        <section>${htmlSlot()}</section>
      </dd>
    </dl>`;
  }

  private renderIcon(): HTMLTemplate {
    if (this.querySelector("slot[name=icon]")) {
      return htmlSlot("icon");
    }
    return svgDeltaSmooth();
  }

  protected firstUpdated() {
    if (this.fill) {
      this.addEvent(this._dd, "click", () => this.toggle());
    }
  }
}

export default DetailsExpand;

declare global {
  interface HTMLElementTagNameMap {
    "details-expand": DetailsExpand;
  }
}
