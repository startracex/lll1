import { createScope, css, type CSSResultGroup, cssvarValues, define, html, property, state } from "../deps.js";
import { htmlSlot, type HTMLTemplate, svgImage } from "../tmpl.js";
import LayoutSTD from "./std.js";

const defineName = "skeleton-screen";
const cssvarScope = createScope(defineName);

@define(defineName)
export class SkeletonScreen extends LayoutSTD {
  @property() type: "text" | "image" = "text";
  @state() loading = true;
  static styles = [
    LayoutSTD.styles,
    css`
      :host {
        display: block;
        min-height: 1.5em;
        overflow: hidden;
        ${cssvarScope}--from: rgb(var(${cssvarValues.textRGB}) / 7.5%);
        ${cssvarScope}--to: rgb(var(${cssvarValues.textRGB}) / 20%);
        ${cssvarScope}--deg: 94deg;
        ${cssvarScope}--color: rgb(var(${cssvarValues.textRGB}) / 50%);
        ${cssvarScope}--background: var(${cssvarValues.main});
        ${cssvarScope}--duration: 1.5s;
        ${cssvarScope}--icon-width: 5em;
        ${cssvarScope}--icon-height: 5em;
        ${cssvarScope}--icon-margin: .75em;
        color: var(${cssvarScope}--color);
        background: var(${cssvarScope}--background);
      }

      p {
        height: 100%;
        min-height: inherit;
        background-image: linear-gradient(var(${cssvarScope}--deg), var(${cssvarScope}--from) 36%, var(${cssvarScope}--to) 50%, var(${cssvarScope}--from) 64%);
        background-color: transparent;
        background-size: 200% 100%;
        animation: var(${cssvarScope}--duration) ease-in-out 0s infinite normal none running kf;
      }

      @keyframes kf {
        from {
          background-position: 150% center;
        }
        to {
          background-position: -50% center;
        }
      }

      path {
        fill: var(${cssvarScope}--color);
      }

      svg,
      slot {
        width: var(${cssvarScope}--icon-width);
        height: var(${cssvarScope}--icon-height);
      }

      svg {
        margin: var(${cssvarScope}--icon-margin);
      }

      p,
      svg {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ] as CSSResultGroup;

  protected render(): HTMLTemplate {
    if (this.loading) {
      return html`<p>${this.renderIcon()}</p>`;
    }
    return htmlSlot();
  }

  private renderIcon(): HTMLTemplate {
    switch (this.type) {
      case "text":
        return htmlSlot("icon");
      case "image":
        return svgImage();
    }
  }
}

export default SkeletonScreen;

declare global {
  interface HTMLElementTagNameMap {
    "skeleton-screen": SkeletonScreen;
  }
}
