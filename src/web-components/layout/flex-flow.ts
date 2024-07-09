import { css, property } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import { styles } from "../../decorators/styles.js";
import { htmlSlot } from "../../lib/directives.js";
import { htmlStyle } from "../../lib/directives.js";
import { joinRules } from "../../lib/utils.js";
import { GodownElement } from "../../proto/godown-element.js";

const protoName = "flex-flow";

/**
 * {@linkcode FlexFlow} provides flex layout.
 */
@godown(protoName)
@styles([
  css`
    :host {
      display: flex;
    }

    :host([vertical]) {
      flex-direction: column;
    }
  `,
])
export class FlexFlow extends GodownElement {
  @property({
    attribute: protoName,
  })
  flexFlow: string;

  @property() direction: string;

  @property() gap: string;

  @property() flex: string;

  @property() justify: string;

  @property() align: string;

  @property() wrap: string;

  @property({ type: Boolean }) vertical: boolean;

  protected render() {
    return [
      htmlSlot(),
      htmlStyle(
        joinRules({
          ":host": {
            "flex-direction": this.direction,
            "flex-wrap": this.wrap,
            gap: this.gap,
            "align-items": this.align,
            "justify-content": this.justify,
            flex: this.flex,
            "flex-flow": this.flexFlow,
          },
        }),
      ),
    ];
  }
}

export default FlexFlow;
