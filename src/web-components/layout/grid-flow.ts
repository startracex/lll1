import { css, property } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { htmlSlot } from "../../lib/directives.js";
import { htmlStyle } from "../../lib/directives.js";
import { joinRules, numerical } from "../../lib/utils.js";
import { GodownElement } from "../../proto/godown-element.js";

const protoName = "grid-flow";

/**
 * {@linkcode GridFlow} provides gird layout.
 */
@godown(protoName)
@styles([
  css`
    :host {
      display: grid;
    }
  `,
])
export class GridFlow extends GodownElement {
  @property() gap: string;
  @property() columns: string | number;
  @property() rows: string | number;
  @property() content: string;
  @property() items: string;

  protected render() {
    return [
      htmlSlot(),
      htmlStyle(
        joinRules({
          ":host": {
            gap: this.gap,
            "grid-template-columns": numerical(this.columns) ? `repeat(${this.columns},1fr)` : this.columns,
            "grid-template-rows": numerical(this.rows) ? `repeat(${this.rows},1fr)` : this.rows,
            "place-content": this.content,
            "place-items": this.items,
          },
        }),
      ),
    ];
  }
}

export default GridFlow;
