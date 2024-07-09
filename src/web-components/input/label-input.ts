import { css, html, property } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { combine, htmlSlot } from "../../lib/directives.js";
import GodownInput from "../../proto/super-input.js";
import { cssGlobalVars } from "../../styles/global.js";
import { fieldStyle, inputStyle } from "../../styles/inputStyle.js";

const protoName = "label-input";

/**
 * {@linkcode LabelInput } renders label and input.
 *
 * When there is a label, the layout will be adjusted according to the width of the screen.
 *
 * Otherwise it behaves similarly to the `Input`.
 *
 */
@godown(protoName)
@styles([
  inputStyle,
  fieldStyle,
  css`
    :host {
      --${cssGlobalVars.input}--label-width: var(--${cssGlobalVars.input}--width);
      width: calc(var(--${cssGlobalVars.input}--width) + var(--${cssGlobalVars.input}--label-width));
      height: var(--${cssGlobalVars.input}--height);
      margin: var(--${cssGlobalVars.input}--outline-width);
      border-radius: var(--${cssGlobalVars.input}--radius);
      margin: var(--${cssGlobalVars.input}--outline-width);
      border-radius: var(--${cssGlobalVars.input}--radius);
      justify-content: space-between;
      display: flex;
    }

    div {
      height: inherit;
      width: var(--${cssGlobalVars.input}--width);
    }

    label {
      display: contents;
      border-radius: inherit;
      height: inherit;
    }

    span {
      flex: 1;
      white-space: nowrap;
      width: var(--${cssGlobalVars.input}--width);
    }

    input {
      flex: 1;
      width: 100%;
      height: inherit;
      background: transparent;
      border-radius: inherit;
      color: var(--${cssGlobalVars.foreground});
    }
    .input-field {
      background: var(--${cssGlobalVars.input}--background);
    }
  `,
])
export class LabelInput extends GodownInput {
  @property() variant: "default" | "outline" = "default";

  protected render() {
    const { makeId: htmlFor } = this;
    return html`<label for="${htmlFor}" part="label">
      <span part="label">${this.label}${htmlSlot()}</span>
      <div class="${combine({ "input-field": true, outline: this.variant === "outline" })}">
        <input
          part="input"
          id="${htmlFor}"
          type="${this.type}"
          ?autofocus="${this.autofocus}"
          placeholder="${this.placeholder}"
          class="${this.type}"
          @input="${this._handleInput}"
        />
        ${this._renderSuffix()}
      </div>
    </label>`;
  }
}

export default LabelInput;
