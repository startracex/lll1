import { css, html, property, type PropertyValueMap, query, state } from "../../deps.js";
import { htmlSlot, type HTMLTemplate } from "../../lib/templates.js";
import { random } from "../../lib/utils.js";
import { createScope, define, GodownElement } from "../../root.js";

const defineName = "typewriter-text";
const cssvarScope = createScope(defineName);

/**
 * TypewriterText renders a typewriter effect to text.
 */
@define(defineName)
export class TypewriterText extends GodownElement {
  /**
   * Raw text.
   */
  @property() text = "";
  /**
   * Start immediately after {@linkcode TypewriterText.firstUpdated}.
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
   * {@linkcode TypewriterText.text} length.
   */
  get len() {
    return this.text.length;
  }

  static styles = [
    css`
      :host {
        ${cssvarScope}--cursor-width: .05em;
        font-family: monospace;
        white-space: nowrap;
      }

      i {
        border-right: var(${cssvarScope}--cursor-width) solid;
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
  ];

  protected render(): HTMLTemplate {
    return html`${htmlSlot()}${this.content}<i class="${(this.ended && "hidden") || ""}"></i>`;
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

export default TypewriterText;

declare global {
  interface HTMLElementTagNameMap {
    "typewriter-text": TypewriterText;
  }
}
