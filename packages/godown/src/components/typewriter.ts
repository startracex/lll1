import { godown } from "@godown/element/decorators/godown.js";
import { styles } from "@godown/element/decorators/styles.js";
import { classList } from "@godown/element/directives/class-list.js";
import { htmlSlot } from "@godown/element/directives/html-slot.js";
import { random } from "@godown/element/tools/lib.js";
import { css, html, type PropertyValueMap } from "lit";
import { property, query, state } from "lit/decorators.js";

import { GlobalStyle, scopePrefix } from "../core/global-style.js";

const protoName = "typewriter";
const cssScope = scopePrefix(protoName);

/**
 * {@linkcode Typewriter} renders a typewriter effect to text.
 *
 * @category effect
 */
@godown(protoName)
@styles(css`
    :host {
      ${cssScope}--cursor-width: .05em;
      font-family: monospace;
      white-space: nowrap;
    }

    i {
      border-right: var(${cssScope}--cursor-width) solid;
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
  `)
class Typewriter extends GlobalStyle {
  /**
   * Raw text.
   */
  @property()
  text = "";
  /**
   * Start immediately after {@linkcode Typewriter.firstUpdated}.
   */
  @property({ type: Boolean })
  stopped = false;
  /**
   * If true, hide the cursor
   */
  @property({ type: Boolean })
  ended = false;
  /**
   * Maximum random time.
   */
  @property({ type: Number })
  max = 100;
  /**
   * Minimum random time.
   */
  @property({ type: Number })
  min = 50;
  /**
   * Fixed time.
   */
  @property({ type: Number })
  delay = 0;
  /**
   * The index at the beginning.
   */
  @property({ type: Number })
  index = 0;
  /**
   * Internal text.
   */
  @state()
  content = "";

  timeoutID: number;
  @query("i")
  _i: HTMLElement;

  /**
   * {@linkcode Typewriter.text} length.
   */
  get len() {
    return this.text.length;
  }

  protected render() {
    return html`${htmlSlot()}${this.content}<i part="cursor" class="${
      classList({
        hidden: this.ended,
      })
    }"></i>`;
  }

  protected firstUpdated() {
    if (!this.text) {
      this.text = this._slot?.assignedNodes()[0]?.textContent.trim() || "";
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
    this.timeoutID = window.setTimeout(() => {
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
