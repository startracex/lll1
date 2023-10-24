import { css, define, html, property } from "../deps.js";
import { htmlSlot } from "../tmpl.js";
import LayoutSTD from "./std.js";

@define("div-line")
export class DivLine extends LayoutSTD {
  static styles = css`
    :host {
      display: block;
      color: currentColor;
      background: none;
    }

    div {
      display: flex;
      align-items: center;
      border-radius: inherit;
      width: 100%;
      height: 100%;
    }

    hr {
      border-radius: inherit;
      margin: 0;
      border: 0;
      flex: 1;
      background: currentColor;
    }

    .v {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  `;
  @property() pre = "auto";
  @property() suf = "auto";
  @property({ type: Boolean }) v = false;
  @property() b = "2.2px";

  render() {
    const hrStyle = `.before{height:${this.b};max-width:${this.pre}}.after{height:${this.b};max-width:${this.suf}}.v .before{width:${this.b};max-height:${this.pre}}.v .after{width:${this.b};max-height:${this.suf}}`;
    return html`<div class="${this.v ? "v" : "h"}">
      <hr class="before" />
      ${htmlSlot()}
      <hr class="after" />
      <style>
        ${hrStyle}
      </style>
    </div>`;
  }
}

export default DivLine;
declare global {
  interface HTMLElementTagNameMap {
    "div-line": DivLine;
  }
}
