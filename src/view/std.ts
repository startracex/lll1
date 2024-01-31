import { css, type CSSResultGroup, property, type PropertyValueMap } from "../deps.js";
import { GodownElement } from "../root.js";

export type OnEvents = string;

export class OpenAble extends GodownElement {
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
  @property() on: OnEvents | void = "";
  /**
   * Disable the event mode.
   */
  @property() off: OnEvents = "click";

  static styles = [
    GodownElement.styles,
    css`
      :host {
        display: block;
        transition: all 0.3s ease-in-out;
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
      }

      dt {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        background: inherit;
        align-items: center;
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

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    const open = _changedProperties.get("open") as boolean;
    if (typeof open === typeof !0) {
      this.dispatchEvent(new CustomEvent("change", { detail: this.open }));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _handelClick(_: MouseEvent) {
    this.toggle();
  }
}

export default OpenAble;
