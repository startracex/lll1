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

export default SearchInput;
declare global {
  interface HTMLElementTagNameMap {
    "search-input": SearchInput;
  }
}
