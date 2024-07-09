import { css } from "lit";

import { cssGlobalVars } from "./global.js";

export const fieldStyle = css`
  .input-field {
    display: flex;
    position: relative;
    align-items: center;
    border-radius: inherit;
    height: inherit;
  }

  .input-field input {
    padding: var(--${cssGlobalVars.input}--padding);
    background: transparent;
  }

  .input-field:focus-within,
  .input-field.outline {
    outline: var(--${cssGlobalVars.input}--outline);
  }

  .input-field input + label {
    padding-right: 0.2em;
  }

  .input-field i {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .input-field i > svg {
    height: 1em;
    width: 1em;
  }

  input::-ms-reveal,
  input::-ms-clear {
    display: none;
  }
`;

export const inputStyle = css`
:host {
  --${cssGlobalVars.input}--width: 10em;
  --${cssGlobalVars.input}--height: 1.6em;
  --${cssGlobalVars.input}--padding: 0 0.2em;
  --${cssGlobalVars.input}--background: var(--${cssGlobalVars.background});
  --${cssGlobalVars.input}--true: var(--${cssGlobalVars.active});
  --${cssGlobalVars.input}--false: var(--${cssGlobalVars.passive});
  --${cssGlobalVars.input}--control:var(--${cssGlobalVars.foreground});
  --${cssGlobalVars.input}--control-edge: var(--${cssGlobalVars.input}--true);
  --${cssGlobalVars.input}--outline-color: var(--${cssGlobalVars.input}--true);
  --${cssGlobalVars.input}--outline-width: .15em;
  --${cssGlobalVars.input}--outline-style: solid;
  --${cssGlobalVars.input}--outline: var(--${cssGlobalVars.input}--outline-width)  var(--${cssGlobalVars.input}--outline-style) var(--${cssGlobalVars.input}--outline-color);
  --${cssGlobalVars.input}--radius: 0.2em;
}
`;
