import Skeleton from "./web-components/skeleton/skeleton.js";
Skeleton.define();
export default Skeleton;
export * from "./web-components/skeleton/skeleton.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-skeleton": Skeleton;
  }
}
