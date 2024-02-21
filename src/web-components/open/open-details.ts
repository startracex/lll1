import { css, type CSSResultGroup, html, property, query } from "../../deps.js";
import { htmlSlot, type HTMLTemplate, svgDeltaSmooth } from "../../lib/templates.js";
import { createScope, cssvarValues, define } from "../../root.js";
import { OpenableElement } from "./open.js";

const defineName = "open-details";

const cssvarScope = createScope(defineName);

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
      :host {
        color: var(${cssvarValues.text});
        ${cssvarScope}--icon-deg-open: -90deg;
        ${cssvarScope}--icon-deg: 0deg;
        ${cssvarScope}--summary-direction: row;
      }
      span {
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
      }

      dl {
        height: 100%;
        position: relative;
        overflow: hidden;
      }

      dt {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        background: inherit;
        align-items: center;
        height: 100%;
        flex-direction: var(${cssvarScope}--summary-direction);
      }

      dd {
        overflow: hidden;
        display: grid;
        grid-template-rows: 0fr;
      }

      * {
        transition: inherit;
      }

      section {
        min-height: 0;
        overflow: hidden;
      }

      i {
        height: 1em;
        wdith: 1em;
        display: flex;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        transform: rotate(var(${cssvarScope}--icon-deg));
      }

      :host([open]) dd {
        grid-template-rows: 1fr;
      }

      :host([float]) dd {
        top: 100%;
        position: absolute;
      }

      :host([open]) i {
        transform: rotate(var(${cssvarScope}--icon-deg-open));
      }
    `,
  ] as CSSResultGroup;

  protected render(): HTMLTemplate {
    return html`<dl>
      <dt @click="${this._handelClick}">
        <span> ${this.summary || htmlSlot("summary")} </span>
        <i>${this.renderIcon()}</i>
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
