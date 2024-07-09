import { css, html, property } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { combine } from "../../lib/directives.js";
import GodownInput from "../../proto/super-input.js";
import { cssGlobalVars } from "../../styles/global.js";
import { fieldStyle, inputStyle } from "../../styles/inputStyle.js";

const protoName = "input";

/**
 * {@linkcode Input }.
 */
@godown(protoName)
@styles([
  inputStyle,
  fieldStyle,
  css`
    :host {
      width: var(--${cssGlobalVars.input}--width);
      height: var(--${cssGlobalVars.input}--height);
      color: var(--${cssGlobalVars.foreground});
      background: var(--${cssGlobalVars.input}--background);
      margin: var(--${cssGlobalVars.input}--outline-width);
      border-radius: var(--${cssGlobalVars.input}--radius);
      display: block;
    }

    input[type="file"] {
      display: none;
    }

    [part="root"] {
      width: 100%;
      display: flex;
      align-items: center;
    }

    * {
      border-radius: inherit;
      cursor: inherit;
    }

    input {
      box-sizing: border-box;
      height: 100%;
      width: 100%;
      margin: 0;
      color: inherit;
      background: transparent;
      border-radius: 0.25em;
    }
  `,
])
export class Input extends GodownInput {
  @property() variant: "default" | "outline" = "default";
  /**
   * Input accept.
   */
  @property() accept: string = undefined;
  /**
   * Value.
   */
  @property() value: string | File | FileList = undefined;
  /**
   * Only single files are allowed to be selected.
   */
  @property({ type: Boolean }) only = false;
  /**
   * Input min.
   */
  @property({ type: Number }) min = 0;
  /**
   * Input max.
   */
  @property({ type: Number }) max = 100;
  /**
   * Input step.
   */
  @property({ type: Number }) step = 1;

  protected render() {
    return html`<div part="root" class="${combine({ "input-field": true, outline: this.variant === "outline" })}">
      <input
        part="input"
        class="input"
        id=${this.makeId}
        .value="${this.value as string}"
        ?autofocus="${this.autofocus}"
        type="${this.type}"
        placeholder="${this.placeholder}"
        min="${this.min}"
        max="${this.max}"
        @input="${this._handleInput}"
      />
      ${this._renderSuffix()}
    </div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.type === "file") {
      this.value = null;
    } else {
      if (!this.default) {
        this.default = (this.value as string) || "";
      }
      if (!this.value) {
        this.value = this.default;
      }
    }
  }
  protected _handleFile(e: any | Event) {
    this.value = !this.only ? e.target.files : e.target.files[0];
    this.dispatchEvent(new CustomEvent("change", { detail: this.value }));
  }

  reset() {
    if (this.type === "file") {
      this.value = null;
      return;
    }
    this._input.value = this.default.toString();
    this.value = this.default;
  }
}

export default Input;
