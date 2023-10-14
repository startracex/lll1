import { html, css, property, classMap, ifDefined, define, cssvar } from "../deps.js";
import STD from "./std.js";
const originstyle = css`
  :host {
    display: inline-block;
    text-decoration: none;
    cursor: pointer;
  }
  .ghost,
  .ghost:hover {
    color: var(${cssvar}--background);
    border-color: var(${cssvar}--background);
    background-color: transparent;
  }
  .ghost:active {
    color: var(${cssvar}--active);
    background-color: var(${cssvar}--background-active);
  }
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: inherit;
    padding: 0;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    font-size: inherit;
    border-radius: inherit;
    border-width: 0.08em;
    border-style: solid;
    cursor: inherit;
    text-decoration: inherit;
    transition: all 0.2s ease-in;
    color: var(${cssvar}--color);
    border-color: var(${cssvar}--border);
    background-color: var(${cssvar}--background);
  }
  a:hover {
    color: var(${cssvar}--hover);
    border-color: var(${cssvar}--border-hover);
    background-color: var(${cssvar}--background-hover);
  }
  a:active {
    transition: 0s;
    color: var(${cssvar}--active);
    border-color: var(${cssvar}--border-active);
    background-color: var(${cssvar}--background-active);
  }
  a[disabled],
  a[disabled]:hover,
  a[disabled]:active {
    color: var(${cssvar}--color-disabled);
    border-color: var(${cssvar}--border-disabled);
    background-color: var(${cssvar}--background-disabled);
  }
`;
const colorful = css`
  .black {
    ${cssvar}--color: #f0f0f0;
    ${cssvar}--border: #444444;
    ${cssvar}--background: #2c2c2c;
    ${cssvar}--hover: #fafafa;
    ${cssvar}--border-hover: #707070;
    ${cssvar}--background-hover: #303030;
    ${cssvar}--active: #fafafa;
    ${cssvar}--border-active: #5a5a5a;
    ${cssvar}--background-active: #3a3a3a;
  }
  .white {
    ${cssvar}--color: #2c2c2c;
    ${cssvar}--border: #44444450;
    ${cssvar}--background: #f8f8f8;
    ${cssvar}--hover: #707070;
    ${cssvar}--border-hover: #44444450;
    ${cssvar}--background-hover: #f4f4f4;
    ${cssvar}--border-active: #aaaaaa;
    ${cssvar}--background-active: #aaaaaa;
  }
  .yellow {
    ${cssvar}--color: #fafafa;
    ${cssvar}--border: #44444450;
    ${cssvar}--background: #ebb10d;
    ${cssvar}--hover: #ececec;
    ${cssvar}--border-hover: #44444450;
    ${cssvar}--background-hover: #f9bd10;
    ${cssvar}--background-active: #d7a422;
    ${cssvar}--border-active: #44444420;
  }
  .gary {
    ${cssvar}--color: #fafafa;
    ${cssvar}--border: #44444450;
    ${cssvar}--background: #51535e;
    ${cssvar}--hover: #ececec;
    ${cssvar}--border-hover: #44444450;
    ${cssvar}--background-hover: #5e616d;
    ${cssvar}--background-active: #3f3d47;
    ${cssvar}--border-active: #44444420;
  }
  .red {
    ${cssvar}--color: #fafafa;
    ${cssvar}--border: #44444450;
    ${cssvar}--background: #d11a2d;
    ${cssvar}--hover: #ececec;
    ${cssvar}--border-hover: #44444450;
    ${cssvar}--background-hover: #c62828;
    ${cssvar}--background-active: #a61b29;
    ${cssvar}--border-active: #44444420;
  }
  .blue {
    ${cssvar}--color: #fafafa;
    ${cssvar}--border: #44444450;
    ${cssvar}--background: #1177b0;
    ${cssvar}--hover: #ececec;
    ${cssvar}--border-hover: #44444450;
    ${cssvar}--background-hover: #11659a;
    ${cssvar}--background-active: #144a74;
    ${cssvar}--border-active: #44444420;
  }
  .green {
    ${cssvar}--color: #fafafa;
    ${cssvar}--border: #44444450;
    ${cssvar}--background: #12aa8c;
    ${cssvar}--hover: #ececec;
    ${cssvar}--border-hover: #44444450;
    ${cssvar}--background-hover: #1db68f;
    ${cssvar}--background-active: #248067;
    ${cssvar}--border-active: #44444420;
  }
`;
@define("base-button")
export class BaseButton extends STD {
  static styles = [originstyle, colorful];
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) ghost = false;
  @property() href: string = undefined;
  @property() target: string = undefined;
  @property() color: "black" | "white" | "yellow" | "gary" | "red" | "blue" | "green" = "black";
  render() {
    return html`<a href=${ifDefined(this.href)} target=${ifDefined(this.target)} ?disabled=${this.disabled} class=${classMap({ ghost: this.ghost, [this.color]: this.color })}> <slot name="pre"></slot><slot></slot><slot name="suf"></slot> </a>`;
  }
}
export default BaseButton;
declare global {
  interface HTMLElementTagNameMap {
    "base-button": BaseButton;
  }
}
