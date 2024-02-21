import { css, type CSSResultGroup, html, property, query } from "../../deps.js";
import { ifValue } from "../../lib/directives.js";
import { htmlSlot, type HTMLTemplate } from "../../lib/templates.js";
import { createScope, cssvarValues, define, GodownElement } from "../../root.js";

const defineName = "card-item";
const cssvarScope = createScope(defineName);

/**
 * CardItem renders a card.
 */
@define(defineName)
export class CardItem extends GodownElement {
  /**
   * Enable rotate.
   */
  @property({ type: Boolean }) rotate = false;

  @query("main") protected _main!: HTMLElement;
  @query("aside") protected _aside!: HTMLElement;

  static styles = [
    GodownElement.styles,
    css`
      :host {
        ${cssvarScope}--offset: .25em;
        ${cssvarScope}--background: var(${cssvarValues.main});
        ${cssvarScope}--wapper-background: none;
        ${cssvarScope}--outline: 0;
        ${cssvarScope}--box-shadow: 0 .05em 1.2em 0 rgb(var(${cssvarValues.textRGB}) / 12%);
        ${cssvarScope}--hr-width: 100%;
        ${cssvarScope}--hr-height: .05em;
        ${cssvarScope}--hr-background: #80808080;
        ${cssvarScope}--padding: .75em;
        margin: auto;
        display: block;
        width: fit-content;
        color: var(${cssvarValues.text});
        border-radius: 0.2em;
      }

      * {
        border-radius: inherit;
        min-height: inherit;
        min-width: inherit;
      }

      main {
        outline: var(${cssvarScope}--outline);
        box-shadow: var(${cssvarScope}--box-shadow);
        background: var(${cssvarScope}--background);
        z-index: 2;
        position: relative;
      }

      aside {
        box-sizing: content-box;
        z-index: 0;
        height: 100%;
        width: 100%;
        position: absolute;
        background: var(${cssvarScope}--wapper-background);
        filter: blur(1em);
        padding: var(${cssvarScope}--offset);
        margin: calc(-1 * var(${cssvarScope}--offset));
      }

      div {
        width: fit-content;
        position: relative;
      }

      i {
        position: absolute;
      }

      hr {
        width: var(${cssvarScope}--hr-width);
        height: var(${cssvarScope}--hr-height);
        margin: auto;
        display: block;
        background: var(${cssvarScope}--hr-background);
      }

      slot {
        display: block;
        padding: var(${cssvarScope}--padding);
      }
    `,
  ] as CSSResultGroup;

  protected render(): HTMLTemplate {
    const HEADER = "header";
    const FOOTER = "footer";
    return html`<div>
      <aside></aside>
      <main>
        ${ifValue(
          this.querySlot(HEADER),
          html`
            ${htmlSlot(HEADER)}
            <hr />
          `,
        )}
        ${htmlSlot()}
        ${ifValue(
          this.querySlot(FOOTER),
          html`
            <hr />
            ${htmlSlot(FOOTER)}
          `,
        )}
      </main>
    </div>`;
  }

  protected firstUpdated() {
    if (this.rotate) {
      this.addEvent(this._main, "mousemove", this._drawRotate.bind(this));
      this.addEvent(this._aside, "mouseleave", this.reset.bind(this));
    }
  }

  /**
   * Cancel the aside offset.
   */
  reset() {
    this._main.style.transition = ".5s";
    this._main.style.transform = "none";
  }

  /**
   * Offset aside.
   * @param e Mouse move event.
   */
  protected _drawRotate(e: MouseEvent) {
    const { left, top, width, height } = this._main.getBoundingClientRect();
    const { clientX, clientY } = e;
    const offsetX = clientX - left;
    const offsetY = clientY - top;
    const rotate = 30;
    const rotateX = -(rotate * (offsetY - height / 2)) / height / 1.5;
    const rotateY = (rotate * (offsetX - width / 2)) / width / 1.5;
    this._main.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    this._main.style.transition = "none";
  }
}

export default CardItem;

declare global {
  interface HTMLElementTagNameMap {
    "card-item": CardItem;
  }
}
