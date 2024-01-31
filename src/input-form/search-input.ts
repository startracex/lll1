import { createScope, cssvarValues, define } from "../root.js";
import { css, type CSSResultGroup, html, ifDefined, property, query, state } from "../deps.js";
import { htmlSlot, type HTMLTemplate, svgSearch } from "../lib/templates.js";
import { InputSTD } from "./std.js";

const defineName = "search-input";

const cssvarInput = createScope(defineName);

@define(defineName)
export class SearchInput extends InputSTD {
  /**
   * Query selectors.
   */
  @property() query = "";
  /**
   * Target selectors.
   */
  @property() target = "";
  /**
   * Enable infer.
   */
  @property({ type: Boolean }) infer = false;
  /**
   * Use remote.
   */
  @property({ type: Boolean }) remote = false;
  /**
   * Float result.
   */
  @property({ type: Boolean, reflect: true }) float = false;
  /**
   * Form action.
   */
  @property() action = "./";
  /**
   * Form method.
   */
  @property() method: "get" | "post" = "get";
  /**
   * Form name.
   */
  @property() name = "q";

  @query("input") _input!: HTMLInputElement;
  @state() list: any[] = [];
  @state() useInfer = async (x: string) => {
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
        ${cssvarInput}--width:var(${cssvarValues.input}--width);
        ${cssvarInput}--input-padding: 0;
        width: var(${cssvarValues.input}--width);
        border-radius: var(${cssvarValues.input}--radius);
      }

      div {
        height: var(${cssvarValues.input}--height);
        flex: 1;
        display: flex;
        z-index: 2;
      }

      form {
        background-color: var(${cssvarValues.input}--background);
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
        outline: var(${cssvarValues.input}--outline);
      }

      ul {
        list-style: none;
        width: 100%;
        pointer-events: none;
        border-radius: inherit;
        z-index: 2;
      }

      :host([float]) ul {
        background: var(${cssvarValues.input}--background);
        padding-top: 1.5em;
        position: absolute;
        z-index: 1;
        top: 0;
      }

      :host([float]:focus) form {
        outline: none;
      }

      :host([float]:focus) ul {
        outline: var(${cssvarValues.input}--outline);
      }

      li {
        padding: 0.1em 0.5em;
        font-size: 0.95rem;
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
        margin-left: 0.25em;
        padding: var(${cssvarInput}--input-padding);
        font-size: 1rem;
      }

      svg {
        height: 100%;
        padding: 1px;
      }
    `,
  ] as CSSResultGroup;

  protected render(): HTMLTemplate {
    return html`<form action="${this.action}" method="${this.method}">
      <div>
        <input .value="${this.value}" ?autofocus="${this.autofocus}" name="${this.name}" @focus="${this._handleInput}" @input="${this._handleInput}" @change="${this._handleChange}" title="" placeholder="${ifDefined(this.pla)}" />
        <button @click="${this._handleSubmit}">${svgSearch()}</button>
      </div>
      <ul>
        ${htmlSlot()} ${this.renderList()}
      </ul>
    </form>`;
  }

  private renderList(): HTMLTemplate | undefined {
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
