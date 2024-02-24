import { css, type CSSResultGroup, html, property } from "../../.deps.js";
import { define } from "../../decorators/define.js";
import { type HTMLTemplate } from "../../lib/templates.js";
import { createScope, cssvar, GodownElement } from "../../supers/root.js";

const defineName = "overbreath";
const cssvarScope = createScope(defineName);

/**
 * OverbreathText renders three animated pieces of text.
 *
 * Inspired by Vercel homepage (2022? - 2023).
 */
@define(defineName)
export class Overbreath extends GodownElement {
  /**
   * One of the texts.
   */
  @property() t1 = "";
  // As t1.
  @property() t2 = "";
  // As t2.
  @property() t3 = "";

  static styles = [
    GodownElement.styles,
    css`
      :host {
        ${cssvarScope}--1-1: #ae0ca5;
        ${cssvarScope}--1-2: #ffd802;
        ${cssvarScope}--2-1: #1fe173;
        ${cssvarScope}--2-2: #582bca;
        ${cssvarScope}--3-1: #00b4f0;
        ${cssvarScope}--3-2: #e614e6;
        ${cssvarScope}--deg: 60deg;
        ${cssvarScope}--1: linear-gradient(var(${cssvarScope}--deg), var(${cssvarScope}--1-1), var(${cssvarScope}--1-2));
        ${cssvarScope}--2: linear-gradient(var(${cssvarScope}--deg), var(${cssvarScope}--2-1), var(${cssvarScope}--2-2));
        ${cssvarScope}--3: linear-gradient(var(${cssvarScope}--deg), var(${cssvarScope}--3-1), var(${cssvarScope}--3-2));
      }
    `,
    css`
      :host {
        display: flex;
        margin: auto;
        width: fit-content;
        font-size: clamp(3.5rem, 10vw, 5.5rem);
        align-items: center;
      }

      @media (max-width: 1280px) {
        :host {
          flex-direction: column;
        }
      }

      *::selection {
        background: none;
      }

      .fg,
      .bg {
        padding: 0 0.05em;
        box-sizing: border-box;
      }

      .bg {
        position: absolute;
        top: 0;
      }

      span {
        display: block;
      }

      .rel {
        position: relative;
        font-weight: 800;
        font-size: inherit;
        letter-spacing: -0.05em;
      }

      .rel:nth-child(1) .fg {
        animation: lg1 8s infinite;
        background-image: var(${cssvarScope}--1);
      }

      .rel:nth-child(2) .fg {
        animation: 8s infinite lg2;
        background-image: var(${cssvarScope}--2);
      }

      .rel:nth-child(3) .fg {
        animation: 8s infinite lg3;
        background-image: var(${cssvarScope}--3);
      }

      .rel:nth-child(1) .bg {
        animation: text1 8s infinite;
      }

      .rel:nth-child(2) .bg {
        animation: text2 8s infinite;
      }

      .rel:nth-child(3) .bg {
        animation: text3 8s infinite;
      }
    `,
    css`
      @keyframes lg1 {
        0%,
        16.667%,
        to {
          opacity: 1;
        }
        33.333%,
        83.333% {
          opacity: 0;
        }
      }

      @keyframes lg2 {
        0%,
        to {
          opacity: 0;
        }
        33.333%,
        50% {
          opacity: 1;
        }
        16.667%,
        66.667% {
          opacity: 0;
        }
      }

      @keyframes lg3 {
        0%,
        50%,
        to {
          opacity: 0;
        }
        66.667%,
        83.333% {
          opacity: 1;
        }
      }

      @keyframes text1 {
        0%,
        16.667%,
        to {
          opacity: 0;
        }
        25%,
        91.667% {
          opacity: 1;
        }
      }

      @keyframes text2 {
        0%,
        to {
          opacity: 1;
        }
        33.333%,
        50% {
          opacity: 0;
        }
        25%,
        58.333% {
          opacity: 1;
        }
      }

      @keyframes text3 {
        0%,
        58.333%,
        91.667%,
        to {
          opacity: 1;
        }
        66.667%,
        83.333% {
          opacity: 0;
        }
      }
    `,
    css`
      span.bg {
        ${cssvarScope}--clip-background: var(${cssvar}--clip-background);
        background: var(${cssvarScope}--clip-background);
      }
      span {
        color: transparent;
        -webkit-text-fill-color: transparent;
        background-clip: text !important;
        -webkit-background-clip: text !important;
        display: inline-flex;
      }
    `,
  ] as CSSResultGroup;

  protected render(): HTMLTemplate[] {
    return [this.t1, this.t2, this.t3].map(this.renderText);
  }

  protected renderText(text: string): HTMLTemplate {
    return html`<span class="rel">
      <span class="bg">${text}</span>
      <span class="fg">${text}</span>
    </span>`;
  }
}

export default Overbreath;

declare global {
  interface HTMLElementTagNameMap {
    "overbreath-text": Overbreath;
  }
}
