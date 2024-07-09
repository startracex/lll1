import AvatarGroup from "./web-components/avatar/avatar-group.js";
AvatarGroup.define();
export default AvatarGroup;
export * from "./web-components/avatar/avatar-group.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-avatar-group": AvatarGroup;
  }
}
