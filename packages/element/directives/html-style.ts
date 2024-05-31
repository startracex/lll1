import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

import { joinRules } from "../tools/css.js";
import { conditionIf } from "./condition-if.js";

/**
 * Style element directive.
 *
 * @param style String of CSS style.
 * @param media Style media attribute.
 */
export const htmlStyle = (style?: string | Record<string, any>, media?: string) => {
  const styleString = typeof style === "string" ? style : joinRules(style);
  return conditionIf(
    styleString,
    html`<style media="${ifDefined(media)}">${styleString}</style>`,
  );
};
