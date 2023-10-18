import { css, CSSResultGroup, define, html, property } from "../deps.js";
import STD, { DLsharecss } from "./std.js";
@define("details-expand")
export class DetailsExpand extends STD {
  @property() summary: string;
  @property({ type: Boolean }) reverse = false;
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean }) fill = false;
  @property({ type: Boolean }) float = false;
  static styles = [
    STD.styles,
    DLsharecss,
    css`
      dl {
        height: 100%;
        position: relative;
      }
      dt {
        height: 100%;
      }
      i {
        height: 1.2em;
        min-width: 1.2em;
        aspect-ratio: 1/1;
        display: flex;
        margin-left: auto;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
      [open] i {
        transform: rotate(-90deg) !important;
      }
      [float] {
        top: 100%;
        position: absolute;
      }
    `,
  ] as CSSResultGroup[];
  render() {
    return html`<dl>
      <dt ?open=${this.open} @click=${() => this.toggle()} style="flex-direction:row${this.reverse ? "-reverse" : ""}">
        <span>${this.summary}<slot name="summary"></slot></span>
        <i style="transform: rotate(${this.reverse ? "-18" : ""}0deg);">${!this.querySelector(`slot[name="icon"]`) ? html`<svg fill="currentColor" viewBox="0 0 16 16"><path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" /></svg>` : html`<slot name="icon"></slot>`}</i>
      </dt>
      <dd ?open=${this.open} ?float=${this.float}>
        <section><slot></slot></section>
      </dd>
    </dl>`;
  }
  firstUpdated() {
    if (this.fill) this.shadowRoot.querySelector("dd").addEventListener("click", () => this.toggle());
  }
  toggle(to = !this.open) {
    this.open = to;
    this.dispatchEvent(new CustomEvent("change", { detail: this.open }));
  }
}
export default DetailsExpand;
declare global {
  interface HTMLElementTagNameMap {
    "details-expand": DetailsExpand;
  }
}
