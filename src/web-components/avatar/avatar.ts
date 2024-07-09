import { css, html, ifDefined, property } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { htmlSlot } from "../../lib/directives.js";
import GodownAnchor from "../../proto/super-a.js";
import { createScope } from "../../styles/global.js";

const protoName = "avatar";
const cssScope = createScope(protoName);

/**
 * {@linkcode Avatar} renders the avatar or name and has a href.
 */
@godown(protoName)
@styles([
  css`
    :host {
      --${cssScope}--avatar-size: 2.4em;
      display: inline-block;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    a {
      display: block;
      color: inherit;
      overflow: hidden;
      position: relative;
      border-radius: inherit;
      width: var(--${cssScope}--avatar-size);
      height: var(--${cssScope}--avatar-size);
    }

    span {
      position: absolute;
      width: 100%;
    }

    a,
    [part="name"] {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    [part="mask"] {
      position: absolute;
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
    }
  `,
])
export class Avatar extends GodownAnchor {
  /**
   * Image src.
   */
  @property() src: string | undefined | null;
  /**
   * Default image src.
   */
  @property() default: string = undefined;
  /**
   * Link href.
   */
  @property() href = undefined;
  /**
   * If the image is not available, the {@linkcode Avatar.format} will be displayed.
   */
  @property() name = "";

  protected render() {
    return html`<a part="root" href="${ifDefined(this.href)}"> ${this.renderAva()} ${htmlSlot("mask")}</a> `;
  }

  private renderAva() {
    if (this.src) {
      return html`<img part="image" src="${this.src}" @error=${this.imgOnError} alt="${this.name}" />`;
    }
    if (this.name) {
      return html`<span part="name">${this.format()}</span>`;
    }
    return htmlSlot();
  }

  format(): string {
    return this.name;
  }

  imgOnError(e: ErrorEvent) {
    if (this.default) {
      (e.target as HTMLImageElement).src = this.default;
    } else {
      this.src = undefined;
    }
  }
}

export default Avatar;

// declare global {
//   interface HTMLElementTagNameMap {
//     ["godown-avatar"]: Avatar
//   }
// }
