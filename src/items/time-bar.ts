import { css, type CSSResultGroup, property } from "../deps.js";
import { define } from "../root.js";
import ItemsSTD from "./std.js";

const defineName = "time-bar";

@define(defineName)
export class TimeBar extends ItemsSTD {
  /**
   * Format strings.
   * {@linkcode TimeBar.fmt}
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
    return this.value || TimeBar.fmt(this.format, this.time);
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
   * @param fm Format string.
   * @param tm Time.
   * @returns F.ormat result\
   *
   * Y for years\
   * M for months\
   * D for days\
   * h for hours\
   * m for minutes\
   * s for seconds\
   * Z for time zones.
   */
  static fmt(fm: string, tm: Date): string {
    if (fm === "") {
      return fm;
    }
    const rest = [];
    fm = fm.replace(/%([ZYMDhms%])/g, (_, p1) => {
      rest.push(p1);
      return "%%";
    });
    const formatNumber = (date: number) => date.toString().padStart(2, "0").split("");
    const z = tm.getTimezoneOffset() / -60;
    const switcher: Record<string, string[]> = {
      Z: [z >= 0 ? "+" + z.toString() : z.toString()],
      Y: tm.getFullYear().toString().split(""),
      M: formatNumber(tm.getMonth() + 1),
      D: formatNumber(tm.getDate()),
      h: formatNumber(tm.getHours()),
      m: formatNumber(tm.getMinutes()),
      s: formatNumber(tm.getSeconds()),
    };
    const result: string[] = [];
    for (const f of fm.split("").reverse()) {
      if (switcher[f]) {
        result.push(switcher[f]?.pop());
      } else {
        result.push(f);
      }
    }
    return result
      .reverse()
      .join("")
      .replace(/%%/g, () => {
        return rest.shift();
      });
  }
}

export default TimeBar;

declare global {
  interface HTMLElementTagNameMap {
    "time-bar": TimeBar;
  }
}
