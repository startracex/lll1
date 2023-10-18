import { css, CSSResultGroup, cssvar, define, html, property, query } from "../deps.js";
import STD from "./std.js";
@define("search-input")
export class SearchInput extends STD {
  @query("input") _input!: HTMLInputElement;
  @property() query = "";
  @property() target = "";
  @property({ type: Boolean }) infer = false;
  @property({ type: Boolean }) remote = false;
  @property() action = "./";
  @property() method: "get" | "post" = "get";
  @property() name = "q";
  @property() value = "";
  @property() pla = undefined;
  @property({ type: Array }) list: any[] = [];
  @property({ type: Boolean }) autofocus = false;
  @property({ attribute: false }) useinfer = async (x: string) => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 400);
    });
    return ["Undefine: useinfer", `Use: useinfer(${x} :string)`, "Return Array<string>"];
  };
  static styles = [
    STD.styles,
    css`
      :host {
        color: var(${cssvar}--text);
        display: inline-block;
        min-height: 1.5rem;
        width: var(${cssvar}--input-width);
        border-radius: 0.75em;
        background: var(${cssvar}--input-background);
      }
      :host(:focus) form {
        outline-color: var(${cssvar}--input-outline);
      }
      div {
        flex: 1;
        display: flex;
      }
      form {
        min-height: 100%;
        outline: 0.145em solid transparent;
        display: flex;
        flex-direction: column;
        background: inherit;
        border-radius: inherit;
        padding: 0;
        width: 100%;
        margin: 0;
        overflow: hidden;
      }
      ul {
        list-style: none;
      }
      li {
        padding: 0.1em 0.5em;
        font-size: 0.95rem;
      }
      li:hover {
        background: var(${cssvar}--input-background-hover);
      }
      button,
      input {
        border: 0;
        background: none;
        outline: none;
      }
      button {
        width: 1.8rem;
        height: 1.5rem;
      }
      input {
        flex: 1;
        min-width: 0;
        box-sizing: border-box;
        padding-left: 0.75em;
        padding-right: 0;
        font-size: 1rem;
      }
    `,
  ] as CSSResultGroup[];
  render() {
    return html`<form action=${this.action} method=${this.method}>
      <div>
        <input name=${this.name} @input=${this._handleInput} @change=${this._handleChange} value=${this.value} title="" placeholder=${this.pla} />
        <button @click=${this._handleSubmit}>
          <svg viewBox="0 0 1024 1024" width="95%" height="100%">
            <path fill="currentColor" d="M745.429333 655.658667c1.173333 0.746667 2.325333 1.578667 3.413334 2.496l114.410666 96a32 32 0 0 1-41.152 49.024l-114.389333-96a32 32 0 0 1-6.208-6.976A297.429333 297.429333 0 0 1 512 768c-164.949333 0-298.666667-133.717333-298.666667-298.666667S347.050667 170.666667 512 170.666667s298.666667 133.717333 298.666667 298.666666a297.386667 297.386667 0 0 1-65.237334 186.325334zM512 704c129.6 0 234.666667-105.066667 234.666667-234.666667s-105.066667-234.666667-234.666667-234.666666-234.666667 105.066667-234.666667 234.666666 105.066667 234.666667 234.666667 234.666667z"></path>
          </svg>
        </button>
      </div>
      <slot></slot>
      ${this.list?.length
        ? html`<ul>
            ${this.list.map((v, i) => html`<li key=${i}>${v}</li>`)}
          </ul>`
        : undefined}
    </form>`;
  }
  _handleSubmit(e) {
    if (!this.remote) e.preventDefault();
    this.dispatchEvent(new CustomEvent("submit", { detail: this.value }));
  }
  async _handleInput(e) {
    const value: string = e.target.value.trim();
    this.value = value;
    if (this.compositing) return;
    if (value && this.infer) {
      this.list = await this.useinfer(value);
      if (!this.value) {
        this.list = [];
      }
    } else {
      this.list = [];
    }
    if (this.target && this.query) {
      const targetElement = document.querySelector(this.target);
      const queryElementCollection = document.querySelectorAll(this.query);
      console.log();
      if (!value || !targetElement || !queryElementCollection.length) {
        document.querySelector(this.target).replaceChildren();
        return;
      }
      for (const e of queryElementCollection) {
        if (e.textContent.includes(value)) {
          targetElement.appendChild(e.cloneNode(true));
        }
      }
    }
    this.dispatchEvent(new CustomEvent("input", { detail: value }));
    this.dispatchEvent(new CustomEvent("change", { detail: value }));
  }
}
const e = [
  { action: "https://www.google.com/search", name: "q", pla: "Google" },
  { action: "https://quark.sm.cn/s", name: "q", pla: "Quark" },
  { action: "https://www.bing.com/search", name: "q", pla: "Bing" },
  { action: "https://www.sogou.com/web", name: "query", pla: "搜狗" },
  { action: "https://yandex.com/search/", name: "text", pla: "Yandex" },
  { action: "https://www.qwant.com/", name: "q", pla: "Qwant" },
];
@define("search-w")
export class SearchW extends STD {
  static styles = [
    STD.styles,
    css`
      :host {
        width: 10em;
        height: 1.5em;
        display: inline-block;
        border-radius: 0.75em;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
        --search: aliceblue;
        --ground: currentColor;
        --search-hover: rgb(20 69 155);
      }
      form {
        color: currentColor;
        display: inline-flex;
        height: 100%;
        box-sizing: border-box;
        position: relative;
        border-radius: inherit;
        margin: 0;
      }
      input {
        border-top-left-radius: inherit;
        border-bottom-left-radius: inherit;
        border-right: 0 !important;
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        margin-top: 0px;
        margin-bottom: 0px;
        margin-left: 0px;
        outline: none;
        flex: 1 1 0%;
        padding-left: 1em;
        padding-right: 3.05em;
        border-width: 0.08em;
        border-style: solid;
        border-image: initial;
        border-color: var(--ground);
        background-color: transparent;
        color: var(--ground);
        transition: all 0.2s;
      }
      button:hover {
        background-color: var(--search-hover);
      }
      button {
        background: currentColor;
        border-top-right-radius: inherit;
        border-bottom-right-radius: inherit;
        margin: 0;
        background: none transparent;
        border-spacing: 0;
        text-align: left;
        align-items: center;
        justify-content: center;
        outline: none;
        border: none;
        display: inline-flex;
        transition: all 0.2s;
        padding: 0;
        font-size: 1em;
        height: 100%;
        width: 2.5em;
        background-color: var(--ground);
      }
      svg {
        text-indent: 0;
        font-size: 1em;
        color: var(--search);
        width: 0.8em;
        height: 0.8em;
      }
      path {
        mix-blend-mode: exclusion;
      }
    `,
  ];
  @property() action: string;
  @property() name: string;
  @property() pla: string;
  @property() origin: string;
  constructor() {
    super();
    Object.assign(this, e[Math.floor(Math.random() * e.length)]);
  }
  render() {
    if (this.origin) {
      Object.assign(
        this,
        e.find((v) => v.pla === this.origin),
      );
    }
    return html`<form action=${this.action} method="get" target="_blank">
      <input name=${this.name} placeholder=${this.pla} />
      <button type="submit" aria-label="Search">
        <svg viewBox="0 0 18 18"><path d="M7.25 0C3.254 0 0 3.254 0 7.25s3.254 7.25 7.25 7.25c1.727 0 3.316-.61 4.563-1.625l4.906 4.906a.757.757 0 0 0 .73.207.766.766 0 0 0 .54-.539.757.757 0 0 0-.208-.73l-4.906-4.907A7.202 7.202 0 0 0 14.5 7.25C14.5 3.254 11.246 0 7.25 0Zm0 1.5A5.74 5.74 0 0 1 13 7.25c0 1.55-.613 2.953-1.605 3.984a1.035 1.035 0 0 0-.16.16A5.726 5.726 0 0 1 7.25 13 5.74 5.74 0 0 1 1.5 7.25 5.74 5.74 0 0 1 7.25 1.5Z" fill="currentColor" fill-rule="nonzero"></path></svg>
      </button>
    </form>`;
  }
}
export default SearchInput;
declare global {
  interface HTMLElementTagNameMap {
    "search-input": SearchInput;
    "search-w": SearchW;
  }
}
