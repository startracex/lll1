import { css, type CSSResultGroup, property, type PropertyValueMap } from "../../deps.js";
import { EventsNames } from "../../lib/event-collection.js";
import { GodownElement } from "../../root.js";

export type Direction4 = "left" | "right" | "top" | "bottom";

export type Direction5 = Direction4 | "center";

export type Direction8 = Direction4 | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type OnEvents = EventsNames | "";

export class OpenableElement extends GodownElement {
  /**
   * Summary text.
   */
  @property() summary = "";
  /**
   * Make the content float.
   */
  @property({ type: Boolean, reflect: true }) float = false;
  /**
   * Open the content.
   */
  @property({ type: Boolean, reflect: true }) open = false;
  /**
   * Enable event mode.
   */
  @property() on: OnEvents = "";
  /**
   * Direction of appearance.
   */
  @property() direction: Direction4 | Direction8 | Direction5 | "" = "";

  static styles = [
    GodownElement.styles,
    css`
      :host {
        display: block;
        transition:
          all 0.3s ease-in-out,
          color 0s,
          background 0s;
        height: fit-content;
      }

      span {
        display: inline-flex;
        align-items: center;
        flex: 1;
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
      }

      * {
        transition: inherit;
      }

      dd {
        overflow: hidden;
        display: grid;
        grid-template-rows: 0fr;
      }

      section {
        min-height: 0;
        overflow: hidden;
      }

      :host([open]) dd {
        grid-template-rows: 1fr;
      }

      :host([float]) dd {
        top: 100%;
        position: absolute;
      }
    `,
  ] as CSSResultGroup;

  toggle(to = !this.open) {
    this.open = to;
  }

  close() {
    this.open = false;
  }

  show() {
    this.open = true;
  }

  protected updated(changedProperties: PropertyValueMap<this>) {
    const open = changedProperties.get("open");
    if (typeof open === typeof !0) {
      this.dispatchEvent(new CustomEvent("change", { detail: this.open }));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _handelClick(_: MouseEvent) {
    this.toggle();
  }
}

export default OpenableElement;
