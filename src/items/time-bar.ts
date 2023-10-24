import { css, CSSResultGroup, define, html, property } from "../deps.js";
import { htmlSlot } from "../tmpl.js";
import ItemsSTD from "./std.js";

@define("time-bar")
export class TimeBar extends ItemsSTD {
  @property() format = "YYYY-MM-DD hh:mm:ss UTFZ";
  @property() value = "";
  @property({ type: Object }) time = new Date();
  @property({ type: Number }) timeout = 0;
  @property({ type: Number }) gap = 0;
  intervalID: number;

  static styles: CSSResultGroup = [
    ItemsSTD.styles,
    css`
      :host {
        text-align: center;
      }
    `,
  ];

  render() {
    return html`${htmlSlot("pre")}${this.value}${htmlSlot()}`;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.value = TimeBar.fmt(this.format, this.time);
    if (this.timeout) {
      this.intervalID = setInterval(() => {
        this.time = new Date(this.time.getTime() + (this.gap || this.timeout));
        this.value = TimeBar.fmt(this.format, this.time);
      }, Math.abs(this.timeout));
    }
  }

  disconnectedCallback(): void {
    clearInterval(this.intervalID);
  }

  static fmt(fm: string, tm: Date): string {
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
