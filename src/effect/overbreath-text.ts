import { createScope, css, define, html, type HTMLTemplate, property } from "../deps.js";
import EffectSTD from "./std.js";

const defineName = "overbreath-text";
const cssvarScope = createScope(defineName);

const theme = css`
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
`;

@define(defineName)
export class OverbreathText extends EffectSTD {
  static styles = [
    theme,
    css`
      :host {
        display: flex;
        margin: auto;
        width: fit-content;
        font-size: clamp(4.4rem, 9vw, 5rem);
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

      .rel {
        line-height: 1;
        position: relative;
      }

      .abs {
        color: currentColor;
        position: absolute;
        top: 0;
      }

      .ani,
      .abs {
        white-space: nowrap;
        box-sizing: border-box;
        padding-right: 2.5px;
        letter-spacing: -2.5px;
        width: fit-content;
        background-clip: text;
        -webkit-background-clip: text;
        font-weight: 800;
        font-size: inherit;
      }

      .ani {
        box-sizing: border-box;
        -webkit-text-fill-color: transparent;
      }

      .rel:nth-child(1) .ani {
        animation: ani1 8s infinite;
        background-image: var(${cssvarScope}--1);
      }

      .rel:nth-child(2) .ani {
        animation: 8s ease 0s infinite normal none running ani2;
        background-image: var(${cssvarScope}--2);
      }

      .rel:nth-child(3) .ani {
        animation: 8s ease 0s infinite normal none running ani3;
        background-image: var(${cssvarScope}--3);
      }

      .rel:nth-child(1) .abs {
        animation: kf1 8s infinite;
      }

      .rel:nth-child(2) .abs {
        animation: kf2 8s infinite;
      }

      .rel:nth-child(3) .abs {
        animation: kf3 8s infinite;
      }

      @keyframes ani1 {
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
      @keyframes ani2 {
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
      @keyframes ani3 {
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
      @keyframes kf1 {
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
      @keyframes kf2 {
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
      @keyframes kf3 {
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
  ];
  @property() t1 = "t1 unset.";
  @property() t2 = "t2 unset..";
  @property() t3 = "t3 unset...";

  protected render(): HTMLTemplate {
    return html`<span class="rel">
        <span class="abs">${this.t1}</span>
        <span class="ani">${this.t1}</span>
      </span>
      <span class="rel">
        <span class="abs">${this.t2}</span>
        <span class="ani">${this.t2}</span>
      </span>
      <span class="rel">
        <span class="abs">${this.t3}</span>
        <span class="ani">${this.t3}</span>
      </span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "overbreath-text": OverbreathText;
  }
}
