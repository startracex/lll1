import { css, html, property, query } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { htmlSlot } from "../../lib/directives.js";
import { svgDeltaSmooth } from "../../lib/icons.js";
import GodownOpenable from "../../proto/super-openable.js";
import { createScope } from "../../styles/global.js";

const protoName = "details";

const cssScope = createScope(protoName);

/**
 * {@linkcode Details} similar to details.
 */
@godown(protoName)
@styles([
  css`
    :host {
      --${cssScope}--icon-deg-open: -90deg;
      --${cssScope}--icon-deg: 0deg;
      --${cssScope}--summary-direction: row;
      --${cssScope}--transition: .3s;
      height: -moz-fit-content;
      height: fit-content;
      display: block;
      transition: var(--${cssScope}--transition);
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
      height: 100%;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      background: inherit;
      align-items: center;
      flex-direction: var(--${cssScope}--summary-direction);
    }

    dd {
      display: grid;
      overflow: hidden;
      grid-template-rows: 0fr;
      transition: var(--${cssScope}--transition);
      transition-property:grid-template-rows;
    }

    section {
      min-height: 0;
      overflow: hidden;
    }

    i {
      height: 1em;
      width: 1em;
      display: flex;
      -webkit-backface-visibility: hidden;
              backface-visibility: hidden;
      transform: rotate(var(--${cssScope}--icon-deg));
      transition: var(--${cssScope}--transition);
    }

    :host([open]) dd {
      grid-template-rows: 1fr;
    }

    :host([float]) dd {
      top: 100%;
      position: absolute;
    }

    :host([open]) i {
      transform: rotate(var(--${cssScope}--icon-deg-open));
    }
  `,
])
export class Details extends GodownOpenable {
  /**
   * If it is true, the summary event scope will fill the element.
   */
  @property({ type: Boolean }) fill = false;
  /**
   * Summary text.
   */
  @property() summary = "";

  @query("dd") _dd: HTMLDataListElement;

  protected render() {
    return html`<dl part="root">
      <dt part="title" @click="${this._handelClick}">
        <span part="summary"> ${this.summary || htmlSlot("summary")} </span>
        <i part="open">${svgDeltaSmooth()}</i>
      </dt>
      <dd part="details" @click=${this.fill ? () => this.toggle() : null}>
        <section part="slot">${htmlSlot()}</section>
      </dd>
    </dl>`;
  }
}

export default Details;
