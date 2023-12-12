import { css, CSSResultGroup, cssvar, define, html, property, state } from "../deps.js";
import { htmlSlot, svgImage } from "../tmpl.js";
import LayoutSTD from "./std.js";

@define("skeleton-screen")
export class SkeletonScreen extends LayoutSTD {
  @property() type: "text" | "image" = "text";
  @state() loading = true;
  static styles = [
    LayoutSTD.styles,
    css`
      :host {
        display: block;
        min-height: 1.5em;
        border-radius: 0.2em;
        overflow: hidden;
        ${cssvar}--skeleton-from: rgb(255 255 255 / 9%);
        ${cssvar}--skeleton-to: rgb(255 255 255 / 18%);
        ${cssvar}--skeleton-deg: 94deg;
        ${cssvar}--skeleton-color: rgb(185 185 185);
        ${cssvar}--skeleton-background: rgb(24 24 24);
        ${cssvar}--skeleton-duration: 1.5s;
        ${cssvar}--skeleton-icon-width: 5em;
        ${cssvar}--skeleton-icon-height: 5em;
        ${cssvar}--skeleton-icon-margin: .75em;
        color: var(${cssvar}--skeleton-color);
        background: var(${cssvar}--skeleton-background);
      }

      p {
        height: 100%;
        min-height: inherit;
        background-image: linear-gradient(var(${cssvar}--skeleton-deg), var(${cssvar}--skeleton-from) 36%, var(${cssvar}--skeleton-to) 50%, var(${cssvar}--skeleton-from) 64%);
        background-color: transparent;
        background-size: 200% 100%;
        animation: var(${cssvar}--skeleton-duration) ease-in-out 0s infinite normal none running kf;
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
        fill: var(${cssvar}--skeleton-color);
      }

      svg,
      slot {
        width: var(${cssvar}--skeleton-icon-width);
        height: var(${cssvar}--skeleton-icon-height);
      }

      svg {
        margin: var(${cssvar}--skeleton-icon-margin);
      }

      p,
      svg {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ] as CSSResultGroup[];

  render() {
    if (this.loading) {
      return html`<p>${this.renderIcon()}</p>`;
    }
    return htmlSlot();
  }

  private renderIcon() {
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
