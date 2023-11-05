import { css, define, DisableWarning, GlobalSTD, html, property, query } from "../deps.js";
import { htmlSlot, htmlStyle, svgArrow } from "../tmpl.js";

@define("rotation-pool")
export class RotationPool extends GlobalSTD {
  @property({ type: Number }) index = 0;
  @property({ type: Number }) autochange = 0;
  @property() width = "";
  @query("section") _section: HTMLElement;
  intervalID: number;
  _clone: HTMLElement[] = [];
  static styles = css`
    :host {
      display: block;
      transition: all 0.2s;
    }

    div {
      overflow: hidden;
    }

    div,
    section {
      width: 100%;
      display: flex;
      position: relative;
      transition: inherit;
    }

    a {
      position: absolute;
      height: 100%;
      width: fit-content;
      z-index: 1;
      display: flex;
      align-items: center;
    }

    .prev {
      left: 0;
    }

    .prev svg {
      transform: rotate(180deg);
    }

    .next {
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

    slot::slotted(*) {
      flex-shrink: 0 !important;
    }
  `;

  render() {
    const style = this.width && `:host{width:${this.width.split(";")[0]};}`;
    return html`<div>
      <a class="prev" @click="${this.prev}">${this.render_a("pre")}</a>
      <section>${htmlSlot()}</section>
      ${htmlStyle(style)}
      <a class="next" @click="${this.next}">${this.render_a("suf")}</a>
    </div>`;
  }

  private render_a(slot: string) {
    if (this.querySelector(`[slot=${slot}]`)) {
      return htmlSlot(slot);
    }
    return html`<i>${svgArrow()}</i>`;
  }

  remount(index?: number) {
    super.remount(undefined);
    if (index !== undefined) {
      this.show(index);
    }
  }

  firstUpdated() {
    if (this.assigned.length) {
      if (!this.width) {
        this.width = `${this.assigned[0].offsetWidth}px`;
      }
      if (this._clone.length) {
        this._clone.forEach((element) => element.remove());
        this._clone = [];
      }
      const last = this.assigned[0].cloneNode(true) as HTMLElement;
      const first = this.assigned[this.assigned.length - 1].cloneNode(true) as HTMLElement;
      first.style.marginLeft = "-100%";
      this._clone.push(first, last);
      this.appendChild(last);
      this.insertBefore(first, this.firstElementChild);
      this.show(this.index);
    }
    if (this.autochange) {
      this.intervalID = setInterval(() => {
        this.next();
      }, this.autochange);
    }
  }

  disconnectedCallback() {
    clearInterval(this.intervalID);
  }

  show(i: number) {
    this.index = i;
    this._section.style.transform = `translateX(-${i}00%)`;
    this._section.style.transition = "inherit";
  }

  next() {
    if (this.index === this.assigned.length - 3) {
      this._section.style.transform = `translateX(100%)`;
      this._section.style.transition = "none";
      this._section.getBoundingClientRect();
      this.show(0);
    } else {
      this.show(this.index + 1);
    }
  }

  prev() {
    if (this.index === 0) {
      this._section.style.transform = `translateX(-${this.assigned.length - 2}00%)`;
      this._section.style.transition = `none`;
      this._section.getBoundingClientRect();
      this.show(this.assigned.length - 3);
    } else {
      this.show(this.index - 1);
    }
  }
}

DisableWarning(RotationPool);

export default RotationPool;
declare global {
  interface HTMLElementTagNameMap {
    "rotation-port": RotationPool;
  }
}
