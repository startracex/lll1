import { html, css, property, define } from "../deps.js";
import STD from "./std.js";
@define("alert-item")
export class AlertItem extends STD {
  static styles = css`
  :host{
    margin: .1em auto;
    width: 100%;
    display: inline-block;
  }
  .hide{
    opacity: 0;
    transform: translateY(-50%);
  }
  .success {
    --color: #3c763d;
    --super: #2b542c;
    --background: #dff0d8;
    --border: #d6e9c6;
  }
  .info {
    --color: #31708f;
    --background: #d9edf7;
    --border: #bce8f1;
    --super: #245269;
  }
  .warning {
    --color: #8a6d3b;
    --background: #fcf8e3;
    --border: #faebcc;
    --super: #66512c;
  }
  .danger {
    --color: #a94442;
    --background: #f2dede;
    --border: #ebccd1;
    --super: #843534;
  }
  .alert {
    display: flex;
    justify-content: space-between;
    padding: .2em .5em;
    border: 1px solid transparent;
    border-radius: 4px;
    transition: all .25s;
    color: var(--color);
    background-color: var(--background);
    border-color: var(--border);
    animation: alert .25s ease-in-out;
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
    margin:0 .25em 0 .35em;
    min-height: 1.6em;
    line-height: 1.6em;
  }
  aside.close {
    height:fit-content;
    width:fit-content;
    border-radius: 50%;
    transition: all .3s;
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
    stroke: var(--super);
  }
  path {
    stroke: var(--color);
    transition: all .3s;
  }
  .alert ::slotted(a) {
    font-weight: bold;
    color: var(--super);
  }`;
  @property() call: "success" | "info" | "warning" | "danger" | "hide" = "info";
  @property({ type: Number }) autoclose = 3000;
  @property() title = "";
  @property() content = "";
  render() {
    if (this.autoclose) setTimeout(() => this.close(), this.autoclose);
    return html`<div class="${this.call} alert" role="alert">
  <section class="content">
    <strong><slot name=title></slot>${this.title}</strong>
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