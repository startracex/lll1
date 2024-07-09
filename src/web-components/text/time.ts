import { type PropertyValues } from "lit";

import { css, property } from "../../_deps.js";
import { godown } from "../../decorators/godown.js";
import styles from "../../decorators/styles.js";
import { GodownElement } from "../../proto/godown-element.js";

const protoName = "time";

/**
 * {@linkcode Time} renders a formatting time.
 */
@godown(protoName)
@styles([
  css`
    :host {
      text-align: center;
    }
  `,
])
export class Time extends GodownElement {
  /**
   * Cancels the next character formatting.
   */
  @property() escape = "%";
  /**
   * Format strings.
   * {@linkcode Time.fmt}
   */
  @property() format = "YYYY-MM-DD hh:mm:ss UTFZ";
  /**
   * Time.
   */
  @property({ type: Object }) time = new Date();
  /**
   * If there is a value, update every gap or timeout.
   */
  @property({ type: Number }) timeout = 0;
  /**
   * The number of milliseconds that change with each update.
   */
  @property({ type: Number }) gap = 0;

  timeoutId: number;

  protected render(): string {
    return Time.fmt(this.format, this.time, this.escape);
  }

  protected firstUpdated() {
    if (this.timeout) {
      this.timeoutId = this.startTimeout();
    }
  }

  protected updated(changedProperties: PropertyValues): void {
    if (changedProperties.has("timeout")) {
      clearInterval(this.timeoutId);
      if (this.timeout) {
        this.timeoutId = this.startTimeout();
      }
    }
  }

  disconnectedCallback() {
    clearInterval(this.timeoutId);
  }

  startTimeout() {
    return setInterval(() => {
      this.time = new Date(this.time.getTime() + (this.gap || this.timeout));
    }, Math.abs(this.timeout));
  }

  /**
   * Y for year\
   * M for month\
   * D for day\
   * h for hour\
   * m for minute\
   * s for second\
   * S for milli Second\
   * Z for time zone.
   *
   * @param fm Format string.
   * @param tm Time.
   * @returns Format result
   */
  static fmt(fm: string, tm: Date, em: string): string {
    if (!fm) {
      return fm;
    }
    tm = typeof tm === "string" ? new Date(tm) : tm;
    if (isNaN(tm.getTime())) {
      return fm;
    }
    const rest = [];
    const replaced = `${em}${em}`;
    fm = fm.replace(new RegExp(`${em}([ZYMDhmsS${em}])`, "g"), (_, p1) => {
      rest.push(p1);
      return replaced;
    });

    function formatNumber(n: number, max = 2) {
      return n.toString().padStart(max, "0").split("");
    }

    const z = tm.getTimezoneOffset() / -60;
    const switcher: Record<string, string[]> = {
      Z: [z >= 0 ? "+" + z.toString() : z.toString()],
      Y: tm.getFullYear().toString().split(""),
      M: formatNumber(tm.getMonth() + 1),
      D: formatNumber(tm.getDate()),
      h: formatNumber(tm.getHours()),
      m: formatNumber(tm.getMinutes()),
      s: formatNumber(tm.getSeconds()),
      S: formatNumber(tm.getMilliseconds(), 3),
    };
    const result: string[] = [];
    for (const f of fm.split("").reverse()) {
      const s = switcher[f]?.pop();
      result.push(s ? s : f);
    }
    return result
      .reverse()
      .join("")
      .replace(new RegExp(replaced, "g"), () => {
        return rest.shift();
      });
  }
}

export default Time;
