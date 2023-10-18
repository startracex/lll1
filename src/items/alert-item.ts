import { css, cssvar, define, html, property } from "../deps.js";
import STD from "./std.js";
@define("alert-item")
export class AlertItem extends STD {
  static styles = css`
    :host {
      margin: 0.1em auto;
      width: 100%;
      display: inline-block;
    }
    .hide {
      opacity: 0;
      transform: translateY(-50%);
    }
    .success {
      ${cssvar}--color: #3c763d;
      ${cssvar}--super: #2b542c;
      ${cssvar}--background: #dff0d8;
      ${cssvar}--border: #d6e9c6;
    }
    .info {
      ${cssvar}--color: #31708f;
      ${cssvar}--background: #d9edf7;
      ${cssvar}--border: #bce8f1;
      ${cssvar}--super: #245269;
    }
    .warning {
      ${cssvar}--color: #8a6d3b;
      ${cssvar}--background: #fcf8e3;
      ${cssvar}--border: #faebcc;
      ${cssvar}--super: #66512c;
    }
    .danger {
      ${cssvar}--color: #a94442;
      ${cssvar}--background: #f2dede;
      ${cssvar}--border: #ebccd1;
      ${cssvar}--super: #843534;
    }
    .alert {
      display: flex;
      justify-content: space-between;
      padding: 0.2em 0.5em;
      border: 1px solid transparent;
      border-radius: 4px;
      transition: all 0.25s;
      color: var(${cssvar}--color);
      background-color: var(${cssvar}--background);
      border-color: var(${cssvar}--border);
      animation: alert 0.25s ease-in-out;
    }
    @keyframes alert {
      0% {
        opacity: 0;
        transform: translateY(-50%);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    section.content {
      margin: 0 0.25em 0 0.35em;
      min-height: 1.6em;
      line-height: 1.6em;
    }
    aside.close {
      height: fit-content;
      width: fit-content;
      border-radius: 50%;
      transition: all 0.3s;
    }
    aside.close:hover {
      backdrop-filter: contrast(115%);
    }
    svg {
      display: block;
      height: 1.6em;
      width: 1.6em;
    }
    aside.close:hover path {
      stroke: var(${cssvar}--super);
    }
    path {
      stroke: var(${cssvar}--color);
      transition: all 0.3s;
    }
    .alert ::slotted(a) {
      font-weight: bold;
      color: var(${cssvar}--super);
    }
  `;
  @property() call: "success" | "info" | "warning" | "danger" | "hide" = "info";
  @property({ type: Number }) autoclose = 3000;
  @property() title = "";
  @property() content = "";
  render() {
    if (this.autoclose) setTimeout(() => this.close(), this.autoclose);
    return html`<div class="${this.call} alert" role="alert">
      <section class="content">
        <strong><slot name="title"></slot>${this.title}</strong>
        <slot></slot>${this.content}
      </section>
      <aside class="close" @click=${this.close}>
        <svg viewBox="0 0 48 48" fill="none">
          <path d="M14 14L34 34" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M14 34L34 14" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </aside>
    </div>`;
  }
  close() {
    this.shadowRoot.querySelector(".alert").classList.add("hide");
    setTimeout(() => {
      this.remove();
    }, 300);
  }
}
export default AlertItem;
declare global {
  interface HTMLElementTagNameMap {
    "alert-item": AlertItem;
  }
}
