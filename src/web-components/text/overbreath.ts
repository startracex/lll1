import { css, html, property } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { htmlStyle } from "../../lib/directives.js";
import { GodownElement } from "../../proto/godown-element.js";
import { colorValues, createScope, cssGlobalVars } from "../../styles/global.js";

const defineName = "overbreath";
const cssScope = createScope(defineName);

/**
 * {@linkcode Overbreath} render the text with a breathing effect.
 *
 * Dynamically generate a breathing effect based on the length of the split text.
 *
 * If there is not enough CSS variable `--${CSSprefix}--${number}`, the initial value will be repeated.
 *
 * Inspired by Vercel home page (2023).
 *
 */
@godown(defineName)
@styles([
  css`
    :host {
      --${cssScope}--deg: 60deg;
      --${cssScope}--1-1: ${colorValues.red[5]};
      --${cssScope}--1-2: ${colorValues.yellow[5]};
      --${cssScope}--2-1: ${colorValues.green[5]};
      --${cssScope}--2-2: ${colorValues.purple[5]};
      --${cssScope}--3-1: ${colorValues.blue[5]};
      --${cssScope}--3-2: ${colorValues.pink[5]};
      --${cssScope}--1: linear-gradient(var(--${cssScope}--deg), var(--${cssScope}--1-1), var(--${cssScope}--1-2));
      --${cssScope}--2: linear-gradient(var(--${cssScope}--deg), var(--${cssScope}--2-1), var(--${cssScope}--2-2));
      --${cssScope}--3: linear-gradient(var(--${cssScope}--deg), var(--${cssScope}--3-1), var(--${cssScope}--3-2));
    }
  `,
  css`
    :host {
      display: flex;
      margin: auto;
      width: -moz-fit-content;
      width: fit-content;
      font-size: 2em;
      align-items: center;
    }

    ::selection {
      background: none;
    }

    .rel {
      position: relative;
      font-weight: 800;
      font-size: inherit;
      letter-spacing: -0.05em;
    }
  `,
  css`
    .nocolor,
    .colorful {
      padding: 0 0.05em;
      box-sizing: border-box;
      display: inline-block;
      animation-iteration-count: infinite;
      -webkit-text-fill-color: transparent;
      -webkit-background-clip: text !important;
      background-clip: text !important;
    }
    .colorful {
      opacity: 0;
      animation-name: colorfulN;
    }
    .nocolor {
      position: absolute;
      top: 0;
      background: var(--${cssGlobalVars.clipBackground});
    }
  `,
])
export class Overbreath extends GodownElement {
  @property() text: string | string[];
  @property() duration: string;
  @property() speedup: string;

  protected render() {
    const texts = this.getTexts();
    const len = texts.length;
    const gap = 100 / 2 / len;
    const duration = this.parseDuration() || len * 2 + 2;
    const t = duration / len;

    return html`${texts.map(this.renderText)}
    ${htmlStyle(
      `.colorful{animation-duration:${duration}s;}` +
        `@keyframes colorfulN{0%,${gap * 3}%{opacity:0;}${gap}%,${gap * 2}%{opacity: 1;}}` +
        texts
          .map((_, index) => {
            const number = index + 1;
            const delay = -1 * t * (len - (number - 2));
            const defaultNumber = ((number - 1) % 3) + 1;
            return `.rel:nth-child(${number}) .colorful{animation-delay:${delay}s;background:var(--${cssScope}--${number},var(--${cssScope}--${defaultNumber}));}`;
          })
          .join(""),
    )}`;
  }

  protected renderText(text: string) {
    return html`<span class="rel">
      <span class="nocolor">${text}</span>
      <span class="colorful">${text}</span>
    </span>`;
  }
  protected getTexts(): string[] {
    return Array.isArray(this.text) ? this.text : (this.text || this.textContent).split(/\s+/).filter((x) => x);
  }

  protected parseDuration() {
    const { duration } = this;
    if (duration) {
      if (duration.endsWith("s")) {
        return parseFloat(duration.slice(0, -1));
      } else if (duration.endsWith("ms")) {
        return parseFloat(duration.slice(0, -2)) / 1000;
      }
    }
  }
}

export default Overbreath;
