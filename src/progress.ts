import Progress from "./web-components/progress/progress.js";
Progress.define();
export default Progress;
export * from "./web-components/progress/progress.js";

declare global {
  interface HTMLElementTagNameMap {
    "g-progress": Progress;
  }
}
