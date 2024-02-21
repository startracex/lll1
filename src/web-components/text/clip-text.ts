import { css, type CSSResultGroup, property } from "../../deps.js";
import { htmlSlot, type HTMLTemplate } from "../../lib/templates.js";
import { createScope, cssvar, define, GodownElement } from "../../root.js";

const defineName = "clip-text";
const cssvarScope = createScope(defineName);

/**
 * ClipText renders a gradient text.
 */
@define(defineName)
export class ClipText extends GodownElement {
  /**
   * The text to be clipped.
   */
  @property() text = "";

  static styles = [
    GodownElement.styles,
    css`
      :host {
        ${cssvarScope}--clip-background: var(${cssvar}--clip-background);
        background: var(${cssvarScope}--clip-background);
        color: transparent;
        -webkit-text-fill-color: transparent;
        background-clip: text !important;
        -webkit-background-clip: text !important;
        display: inline-flex;
      }
    `,
  ] as CSSResultGroup;

  protected render(): HTMLTemplate | string {
    return this.text || htmlSlot();
  }
}

export default ClipText;

declare global {
  interface HTMLElementTagNameMap {
    "clip-text": ClipText;
  }
}
