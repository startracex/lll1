import { css, define, html, property } from "../deps.js";
import STD from "./std.js";
@define("ro-port")
export class ROPort extends STD {
  @property({ type: Number }) index = 0;
  @property({ type: Number }) autochange = 0;
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
      width: 1.4em;
      z-index: 1;
      transition: all 0.3s;
    }
    a:hover {
      background-color: #0000000f;
      padding: 0 0.05em;
    }
    a[prev] {
      left: 0;
    }
    a[next] {
      right: 0;
    }
    :host(:hover) a[prev] {
      margin-left: 0.05em;
    }
    :host(:hover) a[next] {
      margin-right: 0.05em;
    }
    svg {
      display: flex;
      height: 100%;
      width: 1.4em;
    }
  `;
  current = 0;
  get assigned(): any {
    return this.shadowRoot.querySelector("slot").assignedElements();
  }
  render() {
    return html`<div>
      <a @click=${this.prev} prev
        ><svg viewBox="0 0 48 48" fill="none"><path d="M31 36L19 24L31 12" stroke="#1e293b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /></svg
      ></a>
      <section><slot></slot></section>
      <a @click=${this.next} next
        ><svg viewBox="0 0 48 48" fill="none"><path d="M19 12L31 24L19 36" stroke="#1e293b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /></svg
      ></a>
    </div>`;
  }
  firstUpdated() {
    if (this.assigned.length == 0) return;
    (this.shadowRoot.querySelector("div").style as any).width = `${this.assigned[0].offsetWidth}px`;
    this.assigned.forEach((e) => {
      e.style.overflowX = "hidden";
      e.style.transition = "width 0s";
    });
    this.show(this.index);
    if (this.autochange)
      setInterval(() => {
        this.index++;
        if (this.index >= this.assigned.length) this.index = 0;
        this.show(this.index);
      }, this.autochange);
  }
  show(i) {
    (this.shadowRoot.querySelector("section").style as any).width = "100%";
    this.assigned.forEach((e, index) => {
      if (index == i) {
        e.style.width = `100%`;
        e.style.transition = "";
      } else {
        e.style.width = 0;
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
export default ROPort;
declare global {
  interface HTMLElementTagNameMap {
    "ro-port": ROPort;
  }
}
