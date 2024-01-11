import { css, CSSResultGroup, define, html, query } from "../deps.js";
import { htmlSlot, type HTMLTemplate } from "../tmpl.js";
import { debounce } from "../lib/utils.js";
import { OpenAble } from "./std.js";

/**
 * DownDrop will calculate a lateral offset to try to keep the content within the allowable range
 *
 * Any named slot will be available as openable content
 */
@define("down-drop")
export class DownDrop extends OpenAble {
  @query("aside") private _balancer: HTMLDivElement;
  static styles = [
    css`
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

      aside {
        background-color: inherit;
        visibility: hidden;
        top: 100%;
        z-index: 1;
      }

      :host([open]) aside {
        visibility: visible;
      }

      :host([float]) aside {
        position: absolute;
      }
    `,
  ] as CSSResultGroup;

  protected render(): HTMLTemplate {
    return html`<main>
      ${htmlSlot()}
      <aside style="transform:translateX(0);">
        ${this.slottedNames.map((name) => {
          return htmlSlot(name);
        })}
      </aside>
    </main>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEvent(window, "resize", debounce(this._handelResize.bind(this), 500));
  }

  protected async firstUpdated() {
    if (this.on) {
      this.addEvent(this._slot, this.on, () => {
        this.toggle();
      });
      this.addEvent(document, this.off, this._handelClick.bind(this));
    } else {
      this.addEvent(this._slot, "mouseenter", () => {
        this.show();
      });
      this.addEvent(this, "mouseleave", () => {
        this.close();
      });
    }
    await this.updateComplete;
    this.resize();
  }

  protected _handelClick(e: MouseEvent) {
    if (!this.contains(e.target as HTMLElement)) {
      this.close();
    }
  }

  protected _handelResize() {
    this._balancer.style.transform = "translateX(0)";
    this.resize();
  }

  resize() {
    if (!this._balancer) {
      return;
    }
    const offsets = this.offsetParent?.getBoundingClientRect() || document.body.getBoundingClientRect();
    const rectLeft = this._balancer.getBoundingClientRect().left;
    const rectRight = this._balancer.getBoundingClientRect().right;
    const rightWidth = offsets.width - (rectRight - offsets.x);
    const leftWidth = offsets.width - (offsets.right - rectLeft);
    if (rectLeft < 0) {
      this._balancer.style.transform = `translateX(${-leftWidth}px)`;
    } else if (rectRight > offsets.right) {
      this._balancer.style.transform = `translateX(${rightWidth}px)`;
    } else {
      this._balancer.style.transform = "translateX(0)";
    }
  }
}

export default DownDrop;
declare global {
  interface HTMLElementTagNameMap {
    "down-drop": DownDrop;
  }
}
