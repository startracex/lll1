import { godown } from "../../decorators/godown.js";
import GodownSuperA from "../../proto/super-a.js";

const protoName = "link";

/**
 * {@linkcode A} similar to a.
 *
 * Has an optional arrow.
 */
@godown(protoName)
export class A extends GodownSuperA {}

export default A;
