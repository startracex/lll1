import { css, type CSSResultGroup, html, property, query } from "../../.deps.js";
import { define } from "../../decorators/define.js";
import { htmlSlot, type HTMLTemplate, svgSearch } from "../../lib/templates.js";
import { GodownInput } from "../../supers/input.js";
import { createScope, cssvarValues } from "../../supers/root.js";

const defineName = "search-input";

const cssScope = createScope(defineName);

/**
 * {@linkcode SearchInput}  used for search behavior.
 */
@define(defineName)
export class SearchInput extends GodownInput {
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
    GodownInput.styles,
    css`
      :host {
        ${cssScope}--width:var(${cssvarValues.input}--width);
        ${cssScope}--input-padding: 0 0 0 .35em;
        width: var(${cssvarValues.input}--width);
        margin: var(${cssvarValues.input}-outline-width);
        border-radius: var(${cssvarValues.input}--radius);
        background: var(${cssvarValues.input}--background);
      }

      div {
        padding: var(${cssScope}--input-padding);
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
        width: 1.8em;
        height: inherit;
      }

      input {
        flex: 1;
        min-width: 0;
        box-sizing: border-box;
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
        <input .value="${this.value}" ?autofocus="${this.autofocus}" name="${this.name}" @focus="${this._handleInput}" @input="${this._handleInput}" title="" placeholder="${this.pla}" />
        <button @click="${this._handleSubmit}">${htmlSlot("search", svgSearch(), this)}</button>
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

  protected _handleInput(e: Event) {
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
    "g-search-input": SearchInput;
  }
}
