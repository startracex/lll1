import { createScope, cssvarValues, define } from "../root.js";
import { css, type CSSResultGroup, html, property, query } from "../deps.js";
import { htmlSlot, type HTMLTemplate } from "../lib/templates.js";
import ItemsSTD from "./std.js";

const defineName = "card-item";
const cssvarScope = createScope(defineName);

@define(defineName)
export class CardItem extends ItemsSTD {
  static styles = [
    ItemsSTD.styles,
    css`
      :host {
        ${cssvarScope}--offset: .25em;
        ${cssvarScope}--background: var(${cssvarValues.main});
        ${cssvarScope}--wapper-background: none;
        ${cssvarScope}--outline: 1px solid rgb(var(${cssvarValues.textRGB}) / 12.5%);
        ${cssvarScope}--box-shadow: 0 0 .5em 0 rgb(var(${cssvarValues.mainRGB}) / 60%);
        margin: auto;
        display: block;
        width: fit-content;
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
      }

      aside {
        box-sizing: content-box;
        z-index: -1;
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
    `,
  ] as CSSResultGroup;

  /**
   * Enable rotate.
   */
  @property({ type: Boolean }) rotate = false;

  @query("main") protected _main!: HTMLElement;
  @query("aside") protected _aside!: HTMLElement;

  protected render(): HTMLTemplate {
    return html`<div>
      <aside></aside>
      <main>${htmlSlot("header")} ${htmlSlot()} ${htmlSlot("footer")}</main>
    </div>`;
  }

  protected firstUpdated() {
    if (this.rotate) {
      this.addEvent(this._main, "mousemove", (e: MouseEvent) => {
        this._drawRotate(e);
        this._main.style.transition = "none";
      });
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
  }
}

export default CardItem;

declare global {
  interface HTMLElementTagNameMap {
    "card-item": CardItem;
  }
}
