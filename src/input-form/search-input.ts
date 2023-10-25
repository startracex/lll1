import { css, CSSResultGroup, cssvar, define, html, ifDefined, property, query } from "../deps.js";
import { htmlSlot, svgSearch } from "../tmpl.js";
import { InputSTD } from "./std.js";

@define("search-input")
export class SearchInput extends InputSTD {
  @query("input") _input!: HTMLInputElement;
  @property() query = "";
  @property() target = "";
  @property({ type: Boolean }) infer = false;
  @property({ type: Boolean }) remote = false;
  @property() action = "./";
  @property() method: "get" | "post" = "get";
  @property() name = "q";
  @property() pla?: string = undefined;
  @property({ type: Array }) list: any[] = [];
  @property({ type: Boolean }) autofocus = false;
  @property({ attribute: false }) useInfer = async (x: string) => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 400);
    });
    return ["Undefined: useInfer", `Use: useInfer(${x} :string)`, "Return Array<string>"];
  };
  static styles = [
    InputSTD.styles,
    css`
      :host {
        outline: var(${cssvar}--input-outline-width) solid transparent;
        color: var(${cssvar}--text);
        display: inline-block;
        min-height: 1.5rem;
        width: var(${cssvar}--input-width);
        border-radius: 0.75em;
        background: var(${cssvar}--input-background);
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
        background: none;
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

      svg {
        height: 100%;
        padding: 1px;
      }
    `,
  ] as CSSResultGroup[];

  render() {
    return html` <form action="${this.action}" method="${this.method}">
      <div>
        <input name="${this.name}" @input="${this._handleInput}" @change="${this._handleChange}" title="" placeholder="${ifDefined(this.pla)}" />
        <button @click="${this._handleSubmit}">${svgSearch()}</button>
      </div>
      ${htmlSlot()}
      ${this.list?.length
        ? html`<ul>
            ${this.list.map((v, i) => html` <li key="${i}">${v}</li>`)}
          </ul>`
        : ""}
    </form>`;
  }

  protected _handleSubmit(e: Event) {
    if (!this.remote) e.preventDefault();
    this.dispatchEvent(new CustomEvent("submit", { detail: this.value }));
  }

  protected async _handleInput(e: Event) {
    const value: string = this.targetValue(e);
    this.value = value;
    if (this.compositing) return;
    if (value && this.infer) {
      this.list = await this.useInfer(value);
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
