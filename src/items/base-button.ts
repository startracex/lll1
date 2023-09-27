import { html, css, property, classMap, ifDefined, define } from "../deps.js";
import STD from "./std.js";
const originstyle = css`:host {
  display:inline-block;
  text-decoration:none;
  cursor:pointer;
}
.ghost,
.ghost:hover {
  color: var(--background);
  border-color: var(--background);
  background-color: transparent;
}
.ghost:active {
  color: var(--active);
  background-color: var(--background-active);
}
a {
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: inherit;
  padding: 0;
  box-sizing: border-box;
  height:100%;
  width:100%;
  font-size: inherit;
  border-radius: inherit;
  border-width: .08em;
  border-style: solid;
  cursor: inherit;
  text-decoration:inherit;
  transition: all .2s ease-in;
  color: var(--color);
  border-color: var(--border);
  background-color: var(--background);}
a:hover {
  color: var(--hover);
  border-color: var(--border-hover);
  background-color: var(--background-hover);
}
a:active {
  transition:  0s;
  color: var(--active);
  border-color: var(--border-active);
  background-color: var(--background-active);
}
a[disabled],
a[disabled]:hover,
a[disabled]:active {
  color: var(--color-disabled);
  border-color: var(--border-disabled);
  background-color: var(--background-disabled);
}`;
const colorful = css`.black{
  --color: #f0f0f0;
  --border: #444444;
  --background: #2c2c2c;
  --hover: #fafafa;
  --border-hover: #707070;
  --background-hover: #303030;
  --active: #fafafa;
  --border-active: #5a5a5a;
  --background-active: #3a3a3a;
}
.white {
  --color: #2c2c2c;
  --border: #44444450;
  --background: #f8f8f8;
  --hover: #707070;
  --border-hover: #44444450;
  --background-hover: #f4f4f4;
  --border-active: #aaaaaa;
  --background-active: #aaaaaa;
}
.yellow {
  --color: #fafafa;
  --border: #44444450;
  --background: #ebb10d;
  --hover: #ececec;
  --border-hover: #44444450;
  --background-hover: #f9bd10;
  --background-active: #d7a422;
  --border-active: #44444420;
}
.gary {
  --color: #fafafa;
  --border: #44444450;
  --background: #51535e;
  --hover: #ececec;
  --border-hover: #44444450;
  --background-hover: #5e616d;
  --background-active: #3f3d47;
  --border-active: #44444420;
}
.red {
  --color: #fafafa;
  --border: #44444450;
  --background: #d11a2d;
  --hover: #ececec;
  --border-hover: #44444450;
  --background-hover: #c62828;
  --background-active: #a61b29;
  --border-active: #44444420;
}
.blue {
  --color: #fafafa;
  --border: #44444450;
  --background: #1177b0;
  --hover: #ececec;
  --border-hover: #44444450;
  --background-hover: #11659a;
  --background-active: #144a74;
  --border-active: #44444420;
}
.green {
  --color: #fafafa;
  --border: #44444450;
  --background: #12aa8c;
  --hover: #ececec;
  --border-hover: #44444450;
  --background-hover: #1db68f;
  --background-active: #248067;
  --border-active: #44444420;
}`;
@define("base-button")
export class BaseButton extends STD {
  static styles = [originstyle, colorful];
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) ghost = false;
  @property() href: string = undefined;
  @property() target: string = undefined;
  @property() color: "black" | "white" | "yellow" | "gary" | "red" | "blue" | "green" = "black";
  render() {
    return html`<a href=${ifDefined(this.href)} target=${ifDefined(this.target)} ?disabled=${this.disabled} class=${classMap({ ghost: this.ghost, [this.color]: this.color })}>
  <slot name="pre"></slot><slot></slot><slot name="suf"></slot>
</a>`;
  }
}
export default BaseButton;
declare global {
  interface HTMLElementTagNameMap {
    "base-button": BaseButton;
  }
}