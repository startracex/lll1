import { createScope, cssvarValues, define } from "../root.js";
import { css, type CSSResultGroup, html, ifDefined, property, query } from "../deps.js";
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
   * Float result.
   */
  @property({ type: Boolean, reflect: true }) float = false;
  /**
   * Form action.
   */
  @property() action = "";
  /**
   * Form method.
   */
  @property() method: "get" | "post" = "get";
  /**
   * Form name.
   */
  @property() name = "q";

  @query("input") _input!: HTMLInputElement;

  static styles = [
    InputSTD.styles,
    css`
      :host {
        ${cssvarInput}--width:var(${cssvarValues.input}--width);
        ${cssvarInput}--input-padding: 0 0 0 .35em;
        width: var(${cssvarValues.input}--width);
        border-radius: var(${cssvarValues.input}--radius);
        background: var(${cssvarValues.input}--background);
      }

      div {
        padding: var(${cssvarInput}--input-padding);
        height: var(${cssvarValues.input}--height);
        flex: 1;
        display: flex;
        z-index: 2;
      }

      form {
        min-height: 100%;
        outline: 0.145em solid transparent;
        display: flex;
        flex-direction: column;
        border-radius: inherit;
        padding: 0;
        width: 100%;
        margin: 0;
        position: relative;
        overflow: hidden;
      }

      :host([float]) form {
        overflow: visible;
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
        <input .value="${this.value}" ?autofocus="${this.autofocus}" name="${this.name}" @focus="${this._handleInput}" @input="${this._handleInput}" title="" placeholder="${ifDefined(this.pla)}" />
        <button @click="${this._handleSubmit}">${svgSearch()}</button>
      </div>
      <ul>
        ${htmlSlot()}
      </ul>
    </form>`;
  }

  protected _handleSubmit(e: Event) {
    if (!this.action) {
      e.preventDefault();
    }
    this.dispatchEvent(new CustomEvent("submit", { detail: this.value }));
  }

  protected async _handleInput(e: Event) {
    e.stopPropagation();
    const value: string = this.targetValue(e);
    if (value === this.value) {
      return;
    }
    this.value = value;
    if (this.compositing) {
      return;
    }
    if (this.target && this.query) {
      this.searchElements(this.value);
    }
    this.dispatchEvent(new CustomEvent("input", { detail: this.value, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent("change", { detail: this.value, composed: true }));
  }

  searchElements(s: string) {
    const targetElement = document.body.querySelector(this.target);
    const queryElementsCollection = document.body.querySelectorAll(this.query);
    if (!targetElement) {
      return;
    }
    targetElement.replaceChildren();
    if (s && queryElementsCollection.length) {
      for (const e of queryElementsCollection) {
        if (e.textContent.includes(this.value)) {
          targetElement.appendChild(e.cloneNode(true));
        }
      }
    }
  }
}

export default SearchInput;

declare global {
  interface HTMLElementTagNameMap {
    "search-input": SearchInput;
  }
}
