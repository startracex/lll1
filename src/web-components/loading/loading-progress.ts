import { css, type CSSResultGroup, html, property } from "../../deps.js";
import { type HTMLTemplate } from "../../lib/templates.js";
import { cssvarValues, define, GodownElement } from "../../root.js";

const defineName = "loading-progress";

/**
 * LoadProgress similar to  progress.
 */
@define(defineName)
export class LoadingProgress extends GodownElement {
  /**
   * Maximum.
   */
  @property({ type: Number }) max = 1;
  /**
   * Minimum.
   */
  @property({ type: Number }) min = 0;
  /**
   * Input value.
   */
  @property({ type: Number, reflect: true }) value = null;

  static styles = [
    GodownElement.styles,
    css`
      :host,
      div {
        display: inline-flex;
        position: relative;
        width: 10em;
        height: 0.5em;
        border-radius: 0.25em;
        background: var(${cssvarValues.input}--false);
        z-index: 1;
      }

      div i {
        position: absolute;
        border-radius: inherit;
        top: 0;
        left: 0;
        height: 100%;
        background: var(${cssvarValues.cssvar}--accept);
        z-index: 2;
        transition: all 0.3s;
        animation: progress 1.5s ease-in-out infinite alternate;
      }

      @keyframes progress {
        from {
          left: 0;
        }
        to {
          left: 80%;
        }
      }

      div.v i {
        animation: none;
      }
    `,
  ] as CSSResultGroup;

  protected render(): HTMLTemplate {
    let width = 20;
    let className: string;
    if (this.value !== null) {
      width = this.parsePercent(this.value);
      className = "v";
    }
    return html`<div class="${className}">
      <i style="width:${width}%;"></i>
    </div>`;
  }

  /**
   * Convert s to a percentage without a percent sign.
   *
   * @param s String or number to convert.
   * @returns Percentage without a percent sign.
   */
  parsePercent(s: string | number = "0"): number {
    if (String(s).includes("%")) {
      return parseFloat(String(s));
    }
    return (parseFloat(String(s)) / (this.max - this.min)) * 100;
  }
}

export default LoadingProgress;

declare global {
  interface HTMLElementTagNameMap {
    "loading-progress": LoadingProgress;
  }
}
