import { css, html, ifDefined, property, query } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { combine } from "../../lib/directives.js";
import { htmlSlot } from "../../lib/directives.js";
import { svgSearch } from "../../lib/icons.js";
import GodownInput from "../../proto/super-input.js";
import { createScope, cssGlobalVars } from "../../styles/global.js";
import { fieldStyle, inputStyle } from "../../styles/inputStyle.js";

const protoName = "search-input";

const cssScope = createScope(protoName);

/**
 * {@linkcode SearchInput}  used for search behavior.
 */
@godown(protoName)
@styles([
  inputStyle,
  fieldStyle,
  css`
    :host {
      --${cssScope}--width:var(--${cssGlobalVars.input}--width);
      width: var(--${cssGlobalVars.input}--width);
      margin: var(--${cssGlobalVars.input}-outline-width);
      border-radius: var(--${cssGlobalVars.input}--radius);
      background: var(--${cssGlobalVars.input}--background);
      color: var(--${cssGlobalVars.foreground});
      display: block;
    }

    .search {
      width: 100%;
      flex: 1;
      display: flex;
      z-index: 2;
      height: var(--${cssGlobalVars.input}--height);
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

    .result {
      list-style: none;
      width: 100%;
      pointer-events: none;
      border-radius: inherit;
      z-index: 2;
    }

    :host([float]) div.result {
      background: var(--${cssGlobalVars.input}--background);
      padding-top: 1.5em;
      position: absolute;
      z-index: 1;
      top: 0;
    }

    :host([float]:focus) form {
      outline: none;
    }

    :host([float]:focus) .result {
      outline: var(--${cssGlobalVars.input}--outline);
    }

    .icon {
      height: inherit;
      display: flex;
      align-items: center;
      background: none;
      padding-right: 0.25em;
    }

    input {
      flex: 1;
      min-width: 0;
      box-sizing: border-box;
    }

    svg {
      height: 1em;
      width: 1em;
    }
  `,
])
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
   * @deprecated
   */
  infer: boolean;
  /**
   * Float result.
   */
  @property({ type: Boolean, reflect: true }) float = false;
  /**
   * Form action.
   */
  @property() action: string;
  /**
   * Form method.
   */
  @property() method: "get" | "post" = "get";
  /**
   * Form name.
   */
  @property() name = "q";

  @property() variant: "default" | "outline" = "default";

  @query("input") _input!: HTMLInputElement;

  protected render() {
    return html`<form
      part="root"
      class="${combine(
        {
          outline: this.variant === "outline",
        },
        "input-field",
      )}"
      action="${ifDefined(this.action)}"
      method="${this.method}"
    >
      <div class="search">
        <input
          .value="${this.value}"
          ?autofocus="${this.autofocus}"
          name="${this.name}"
          @focus="${this._handleInput}"
          @input="${this._handleInput}"
          placeholder="${this.placeholder}"
        />
        <div class="icon" @click="${this._handleSubmit}">${svgSearch()}</div>
      </div>
      <div class="result">${htmlSlot()}</div>
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
