import { css, define, html, query } from "../deps.js";
import { htmlSlot } from "../tmpl.js";
import { OpenAble } from "./std.js";

@define("down-drop")
export class DownDrop extends OpenAble {
  @query("div") _div: HTMLDivElement;
  _timer: number;
  static styles = css`
    :host {
      height: 100%;
      width: 100%;
    }

    main {
      height: inherit;
      width: inherit;
      display: flex;
      position: relative;
      flex-direction: column;
      align-items: center;
    }

    div {
      background-color: inherit;
      visibility: hidden;
      top: 100%;
    }

    :host([open]) div {
      visibility: visible;
    }

    :host[float] div {
      position: "absolute";
    }
  `;

  render() {
    return html`<main>
      <slot
        name="hover"
        @mouseenter="${() => {
          this.toggle(true);
        }}"
      ></slot>
      <slot name="focus" @click="${() => this.toggle()}"></slot>
      <div style="transform:translateX(0);">${htmlSlot()}</div>
    </main>`;
  }

  async firstUpdated() {
    if (this.querySelector("[slot=focus]")) {
      this.addEvent(document, "click", this._handelClick.bind(this));
    }
    if (this.querySelector("[slot=hover]")) {
      this.addEvent(this, "mouseleave", () => {
        this.toggle(false);
      });
    }
    await this.updateComplete;
    this.resize();
    this.addEvent(window, "resize", this._handelResize.bind(this));
  }

  protected _handelClick(e: MouseEvent) {
    if (!this.contains(e.target as HTMLElement)) {
      this.close();
    }
  }

  protected _handelResize() {
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this._div.style.transform = "translateX(0)";
      this.resize();
    }, 250);
  }

  resize() {
    const offsets = this.offsetParent?.getBoundingClientRect() || document.body.getBoundingClientRect();
    const divLeft = this._div.getBoundingClientRect().left;
    const divRight = this._div.getBoundingClientRect().right;
    const RightWidth = offsets.width - (divRight - offsets.x);
    const LeftWidth = offsets.width - (offsets.right - divLeft);
    if (divLeft < 0) {
      this._div.style.transform = `translateX(${-LeftWidth}px)`;
    } else if (divRight > offsets.right) {
      this._div.style.transform = `translateX(${RightWidth}px)`;
    } else {
      this._div.style.transform = "translateX(0)";
    }
  }
}

export default DownDrop;
declare global {
  interface HTMLElementTagNameMap {
    "down-drop": DownDrop;
  }
}
