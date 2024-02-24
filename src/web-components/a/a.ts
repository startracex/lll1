import { define } from "../../decorators/define.js";
import GodownAnchor from "../../supers/anchor.js";

const defineName = "a";

/**
 * {@linkcode A} similar to a.
 *
 * Has an optional arrow.
 */
@define(defineName)
export class A extends GodownAnchor {}

export default A;

declare global {
  interface HTMLElementTagNameMap {
    "super-a": A;
    "g-a": A;
  }
}
