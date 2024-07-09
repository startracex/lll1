import Avatar from "./web-components/avatar/avatar.js";
Avatar.define();
export default Avatar;
export * from "./web-components/avatar/avatar.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-avatar": Avatar;
  }
}
