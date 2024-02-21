import { css, type CSSResultGroup, html, property, query } from "../../deps.js";
import { ifValue } from "../../lib/directives.js";
import { htmlSlot, type HTMLTemplate, svgDeltaSmooth } from "../../lib/templates.js";
import { define } from "../../root.js";
import { OpenableElement } from "./open.js";

const defineName = "open-details";

/**
 * OpenDetails similar to details.
 */
@define(defineName)
export class OpenDetails extends OpenableElement {
  /**
   * If it is true, the summary event scope will fill the element.
   */
  @property({ type: Boolean }) fill = false;
  /**
   * Reverse summary.
   */
  @property({ type: Boolean }) reverse = false;

  @query("dd") _dd: HTMLDataListElement;

  static styles = [
    OpenableElement.styles,
    css`
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
      <dt @click="${this._handelClick}" style="flex-direction:row${ifValue(this.reverse, "-reverse")}">
        <span> ${this.summary || htmlSlot("summary")} </span>
        <i style="transform: rotate(${ifValue(this.reverse, "-18")}0deg);"> ${this.renderIcon()} </i>
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

export default OpenDetails;

declare global {
  interface HTMLElementTagNameMap {
    "open-details": OpenDetails;
  }
}
