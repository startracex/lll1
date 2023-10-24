import { css, CSSResultGroup, define, html, property, query } from "../deps.js";
import { htmlSlot, svgDeltaSmooth } from "../tmpl.js";
import ViewSTD, { dlShareCSS } from "./std.js";

@define("details-expand")
export class DetailsExpand extends ViewSTD {
  @property() summary = "";
  @property({ type: Boolean, reflect: true }) float = false;
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean }) fill = false;
  @property({ type: Boolean }) reverse = false;
  @query("dd") _dd: HTMLDataListElement;
  static styles = [
    ViewSTD.styles,
    dlShareCSS,
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
  ] as CSSResultGroup[];

  render() {
    return html`<dl>
      <dt @click="${this._handelClick}" style="flex-direction:row${this.reverse ? "-reverse" : ""}">
        <span> ${this.summary || htmlSlot("summary")} </span>
        <i style="transform: rotate(${this.reverse ? "-18" : ""}0deg);"> ${!this.querySelector("slot[name=icon]") ? svgDeltaSmooth() : htmlSlot("icon")} </i>
      </dt>
      <dd ?float="${this.float}">
        <section>${htmlSlot()}</section>
      </dd>
    </dl>`;
  }

  firstUpdated() {
    if (this.fill) {
      this.addEvent(this._dd, "click", () => this.toggle());
    }
  }

  _handelClick() {
    this.toggle();
  }

  toggle(to = !this.open) {
    this.open = to;
    this.dispatchEvent(new CustomEvent("change", { detail: this.open }));
  }
}

export default DetailsExpand;
declare global {
  interface HTMLElementTagNameMap {
    "details-expand": DetailsExpand;
  }
}
