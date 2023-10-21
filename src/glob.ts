import { css, CSSResultGroup, LitElement, unsafeCSS, type WarningKind } from "lit";
import { conf } from "./conf.js";

/**
 * Custom CSS variable,join with "--" ,only allow `a-Z,0-9,-`
 */
export const cssvar = unsafeCSS("--" + conf.cssvar.replace(/[^a-zA-Z0-9\\-]/g, ""));

export class GlobalSTD extends LitElement {
  static styles = css`
    :host {
      ${cssvar}--text-selection: rgb(80 255 255);
      ${cssvar}--text-selection-background: rgb(0 0 0 / 10%);
    }

    * {
      font-size: 100%;
      color: inherit;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    ::selection {
      color: var(${cssvar}--text-selection);
      background: var(${cssvar}--text-selection-background);
    }
  ` as CSSResultGroup;

  get assigned() {
    return this._slot?.assignedElements() as HTMLElement[];
  }

  get _slot() {
    return this.shadowRoot.querySelector("slot");
  }

  get offsetsWidth() {
    return this.offsetParent?.clientWidth ?? document.body.offsetWidth;
  }

  get offsetsHeight() {
    return this.offsetParent?.clientHeight ?? document.body.offsetHeight;
  }
}

export function DisableWarning(e: { disableWarning?: (warningKind: WarningKind) => void }, ...w: WarningKind[]) {
  if (w.length) {
    for (const ww of w) {
      e.disableWarning?.(ww);
    }
  } else {
    e.disableWarning?.("change-in-update");
  }
}
