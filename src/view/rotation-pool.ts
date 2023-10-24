import { css, define, html, property, query } from "../deps.js";
import { htmlSlot, svgArrow } from "../tmpl.js";
import ViewSTD from "./std.js";

@define("rotation-pool")
export class RotationPool extends ViewSTD {
  @property({ type: Number }) index = 0;
  @property({ type: Number }) autochange = 0;
  @property() width = "";
  @query("div") _div: HTMLDivElement;
  @query("section") _section: HTMLElement;
  static styles = css`
    :host {
      display: block;
    }

    div,
    section {
      display: flex;
      position: relative;
    }

    div {
      min-width: 5.8em;
      overflow: hidden;
    }

    a {
      position: absolute;
      height: 100%;
      width: fit-content;
      z-index: 1;
    }

    a[prev] {
      left: 0;
    }

    a[prev] svg {
      transform: rotate(180deg);
    }

    a[next] {
      right: 0;
    }

    i {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.3s;
      width: 2em;
      height: 100%;
    }

    svg {
      flex: 1;
      max-height: 100%;
      max-width: 100%;
    }

    a:hover i {
      background-color: #0000001a;
      width: 2.2em;
    }

    i svg path {
      stroke-width: 4;
    }
  `;
  current = 0;

  render() {
    return html`<div>
      <a @click="${this.prev}" prev> ${this.render_a("pre")}</a>
      <section>${htmlSlot()}</section>
      <a @click="${this.next}" next> ${this.render_a("suf")} </a>
    </div>`;
  }

  render_a(slot: string) {
    if (this.querySelector(`[slot=${slot}]`)) {
      return htmlSlot(slot);
    }
    return html`<i>${svgArrow()}</i>`;
  }

  firstUpdated() {
    if (!this.assigned.length || !this.assigned[0]?.offsetWidth) {
      return;
    }
    this._div.style.width = this.width || `${this.assigned[0].offsetWidth}px`;
    this.assigned.forEach((e) => {
      e.style.overflowX = "hidden";
      e.style.transition = "width 0s";
    });
    this.show(this.index);
    if (this.autochange) {
      setInterval(() => {
        this.index++;
        if (this.index >= this.assigned.length) {
          this.index = 0;
        }
        this.show(this.index);
      }, this.autochange);
    }
  }

  show(i: number) {
    (this._section.style as any).width = "100%";
    this.assigned.forEach((e, index) => {
      if (index == i) {
        e.style.width = "100%";
        e.style.transition = "";
      } else {
        e.style.width = "0";
      }
    });
    this.current = i;
  }

  next() {
    this.index++;
    if (this.index >= this.assigned.length) this.index = 0;
    this.show(this.index);
  }

  prev() {
    this.index--;
    if (this.index < 0) this.index = this.assigned.length - 1;
    this.show(this.index);
  }
}

export default RotationPool;
declare global {
  interface HTMLElementTagNameMap {
    "rotation-port": RotationPool;
  }
}
