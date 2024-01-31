import { createScope, cssvarValues, define } from "../root.js";
import { css, html, property, state } from "../deps.js";
import { htmlSlot, type HTMLTemplate } from "../lib/templates.js";
import { deepQuerySelectorAll } from "../lib/utils.js";
import GroupSTD from "./std.js";
import type { PropertyValueMap } from "lit";

const defineName = "tab-group";

const cssvarScope = createScope(defineName);

@define(defineName)
export class TabGroup extends GroupSTD {
  static styles = [
    GroupSTD.styles,
    css`
      :host {
        ${cssvarScope}--background: var(${cssvarValues.main});
        ${cssvarScope}--background-active: rgb(var(${cssvarValues.textRGB}) / 18%);
        ${cssvarScope}--radius: .25em;
        ${cssvarScope}--cursor: default;
        background: var(${cssvarScope}--background);
        display: block;
      }

      nav {
        display: grid;
        grid-auto-flow: column;
        gap: 0.5em;
        position: relative;
        border-radius: inherit;
      }

      section {
        white-space: nowrap;
        min-width: 2em;
        border-radius: inherit;
        padding: 0 0.2em;
        cursor: var(${cssvarScope}--cursor);
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #slider {
        height: 100%;
        position: absolute;
        padding: 0;
        background: var(${cssvarScope}--background-active);
        transform: translateX(-50%);
        transition: all 0.25s ease 0s;
        z-index: 0;
      }
    `,
  ];

  /**
   * Active slot name.
   */
  @property() index = "";
  /**
   * Default slot name.
   */
  @property() def = "";
  /**
   * Align type.
   */
  @property() align = "start";
  /**
   * Header texts or slot names, if headers is a zero value, it is taken from the {@linkcode TabGroup.contents}.
   */
  @state() headers: string[] | void;
  /**
   * Contents slot names.
   */
  @state() contents: string[];

  protected render(): HTMLTemplate {
    const headers = (this.headers || this.contents).map((value) => {
      return html`<section
        class="${this.index === value ? "active" : ""}"
        @click="${() => {
          this.select(value, true);
        }}"
      >
        ${this.headers ? htmlSlot(value) : value}
      </section>`;
    });
    return html`
      <nav style="justify-content:${this.align}">
        ${headers}
        <section id="slider"></section>
      </nav>
      ${htmlSlot(this.index || this.def)}
    `;
  }

  protected updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    if (changedProperties.has("index")) {
      // Move slider.
      const active = this.shadowRoot.querySelector<HTMLElement>("section.active");
      const slider = this.shadowRoot.querySelector<HTMLElement>("#slider");
      if (active) {
        this.dispatchEvent(new CustomEvent("select", { detail: this.index }));
        slider.style.width = `${active.clientWidth}px`;
        slider.animate([{ left: `${active.offsetLeft + active.clientWidth / 2}px` }], { duration: 250, fill: "forwards" });
      } else {
        slider.style.width = "0";
      }
    }
  }

  /**
   * Select one tab.
   * @param s New index.
   * @param callSync if true, update all same elements (headers contains s).
   */
  select(s: string, callSync = false) {
    if (callSync) {
      const elements = deepQuerySelectorAll<this>(this.tagName, document.body);
      for (const e of elements) {
        if ((e.headers || e.contents).includes(s)) {
          e.select(s);
        }
      }
      return;
    }
    this.index = s;
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.def) {
      this.def = this.slottedNames[0] || "";
    }
    if (!this.index && this.def) {
      this.index = this.def;
    }
    this.getTabs();
  }

  /**
   * Update content controls (this.headers, this.contents).
   */
  getTabs() {
    this.contents = this.slottedNames;
  }
}

export default TabGroup;

declare global {
  interface HTMLElementTagNameMap {
    "tab-group": TabGroup;
  }
}
