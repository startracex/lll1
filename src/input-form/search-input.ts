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
  @property({ type: Boolean, reflect: true }) float = false;
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
        color: var(${cssvar}--text);
        display: inline-block;
        width: 100%;
        border-radius: 0.75em;
      }

      div {
        height: var(${cssvar}--input-height);
        flex: 1;
        display: flex;
        z-index: 2;
      }

      form {
        background-color: var(${cssvar}--input-background);
        min-height: 100%;
        outline: 0.145em solid transparent;
        display: flex;
        flex-direction: column;
        border-radius: inherit;
        padding: 0;
        width: 100%;
        margin: 0;
        position: relative;
      }

      :host([float]) form {
        background: none;
      }

      :host(:focus) form {
        outline: var(${cssvar}--input-outline-width) solid var(${cssvar}--input-outline-color);
      }

      ul {
        list-style: none;
        width: 100%;
        pointer-events: none;
        border-radius: inherit;
        z-index: 2;
      }

      :host([float]) ul {
        background: var(${cssvar}--input-background);
        padding-top: 1.5em;
        position: absolute;
        z-index: 1;
        top: 0;
      }

      :host([float]:focus) form {
        outline: none;
      }

      :host([float]:focus) ul {
        outline: var(${cssvar}--input-outline-width) solid var(${cssvar}--input-outline-color);
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
    return html`<form action="${this.action}" method="${this.method}">
      <div>
        <input name="${this.name}" @focus="${this._handleInput}" @input="${this._handleInput}" @change="${this._handleChange}" title="" placeholder="${ifDefined(this.pla)}" />
        <button @click="${this._handleSubmit}">${svgSearch()}</button>
      </div>
      <ul>
        ${htmlSlot()} ${this.render_list()}
      </ul>
    </form>`;
  }

  private render_list() {
    if (this.list && this.list.length && this.value) {
      return html`${this.list.map((v) => html` <li>${v}</li>`)}`;
    }
  }

  protected _handleSubmit(e: Event) {
    if (!this.remote) {
      e.preventDefault();
    }
    this.dispatchEvent(new CustomEvent("submit", { detail: this.value }));
  }

  protected async _handleInput(e: Event) {
    const value: string = this.targetValue(e);
    this.value = value;
    if (this.compositing) {
      return;
    }
    if (this.target && this.query) {
      const targetElement = document.querySelector(this.target);
      const queryElementsCollection = document.querySelectorAll(this.query);
      if (!value || !targetElement || !queryElementsCollection.length) {
        return;
      }
      targetElement.replaceChildren();
      for (const e of queryElementsCollection) {
        if (e.textContent.includes(value)) {
          targetElement.appendChild(e.cloneNode(true));
        }
      }
    }
    if (value && this.infer) {
      this.list = await this.useInfer(value);
      return;
    } else {
      this.list = [];
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
