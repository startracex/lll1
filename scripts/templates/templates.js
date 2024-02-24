export const exportAsDefault = `export { default } from "$0";
`;

export const exportItem = `export $0 from "$1";
`;

export const react_export_Header = `"use client";
import { create } from "./create.js";
`;

export const react_exportItem = `
export const $0 = create({
  elementClass: (await import("$1")).default,
});
`;

export const newElement = `import { css, CSSResultGroup, html, property } from "../../.deps.js";
import { define } from "../../decorators/define.js";
import { type HTMLTemplate } from "../../lib/templates.js";
import { GodownElement } from "../../supers/root.js";

/**
 * {@linkcode $1}.
 */
@define("$0")
export class $1 extends GodownElement {
  @property() property = "";

  static styles: CSSResultGroup = [
    GodownElement.styles,
    css\`
    
    \`,
  ];

  protected render(): HTMLTemplate {
    return html\`
      $0
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "$0": $1;
  }
}
`;

export const newElement_LitElement = `import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators";

@customElement("$0")
export class $1 extends LitElement {

  @property()
  property = "";

  static styles = css\`
  
  \`;

  protected render() {
    return html\`
      $0
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "$0": $1;
  }
}
`;
