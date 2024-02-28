import { css, type CSSResultGroup, property } from "../../.deps.js";
import { define } from "../../decorators/define.js";
import { GodownElement } from "../../supers/root.js";

const defineName = "time";

/**
 * {@linkcode Time} renders a formatting time.
 */
@define(defineName)
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
   * Display content.
   */
  @property() value = "";
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

  intervalID: number;

  static styles: CSSResultGroup = [
    css`
      :host {
        text-align: center;
      }
    `,
  ];

  protected render(): string {
    return this.value || Time.fmt(this.format, this.time, this.escape);
  }

  protected firstUpdated() {
    if (this.timeout) {
      this.intervalID = setInterval(() => {
        this.time = new Date(this.time.getTime() + (this.gap || this.timeout));
      }, Math.abs(this.timeout));
    }
  }

  disconnectedCallback() {
    clearInterval(this.intervalID);
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
    if (isNaN(tm.getTime())) {
      return undefined;
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
      if (s) {
        result.push(s);
      } else {
        result.push(f);
      }
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

declare global {
  interface HTMLElementTagNameMap {
    "time-bar": Time;
  }
}
