import { css, html, property, type PropertyValueMap, query, state } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { htmlSlot } from "../../lib/directives.js";
import { random } from "../../lib/utils.js";
import { GodownElement } from "../../proto/godown-element.js";
import { createScope } from "../../styles/global.js";

const protoName = "typewriter";
const cssScope = createScope(protoName);

/**
 * {@linkcode Typewriter} renders a typewriter effect to text.
 */
@godown(protoName)
@styles([
  css`
    :host {
      --${cssScope}--cursor-width: .05em;
      font-family: monospace;
      white-space: nowrap;
    }

    i {
      border-right: var(--${cssScope}--cursor-width) solid;
      margin-left: 0.02em;
      animation: s 1.5s steps(1) infinite;
    }

    @keyframes s {
      0% {
        border-color: currentColor;
      }
      50% {
        border-color: transparent;
      }
    }

    slot {
      display: none;
    }

    .hidden {
      visibility: hidden;
    }
  `,
])
export class Typewriter extends GodownElement {
  /**
   * Raw text.
   */
  @property() text = "";
  /**
   * Start immediately after {@linkcode Typewriter.firstUpdated}.
   */
  @property({ type: Boolean }) stopped = false;
  /**
   * If true, hide the cursor
   */
  @property({ type: Boolean }) ended = false;
  /**
   * Maximum random time.
   */
  @property({ type: Number }) max = 100;
  /**
   * Minimum random time.
   */
  @property({ type: Number }) min = 50;
  /**
   * Fixed time.
   */
  @property({ type: Number }) delay = 0;
  /**
   * The index at the beginning.
   */
  @property({ type: Number }) index = 0;
  /**
   * Internal text.
   */
  @state() content = "";

  timeoutID: number;
  @query("i") _i: HTMLElement;

  /**
   * {@linkcode Typewriter.text} length.
   */
  get len() {
    return this.text.length;
  }

  protected render() {
    return html`${htmlSlot()}${this.content}<i part="cursor" class="${(this.ended && "hidden") || ""}"></i>`;
  }

  protected firstUpdated() {
    if (!this.text) {
      this.text = this.assignedNodes[0]?.textContent.trim() || "";
    }
    if (!this.stopped && this.len) {
      this.write();
    }
  }

  protected updated(changedProperties: PropertyValueMap<this>) {
    if (changedProperties.has("index")) {
      this.dispatchEvent(new CustomEvent(this.index === this.len ? "done" : "write", { detail: this.content }));
    }
  }

  write(at = this.index) {
    this.content = this.text.slice(0, at + 1);
    const timeout = this.delay || random(this.max, this.min);
    this.timeoutID = setTimeout(() => {
      const nx = at + 1;
      if (nx <= this.len) {
        this.index = nx;
        this.write();
      }
    }, timeout);
  }

  stop() {
    clearTimeout(this.timeoutID);
  }

  end() {
    this.ended = true;
  }
}

export default Typewriter;
