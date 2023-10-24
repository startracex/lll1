import { css, GlobalSTD } from "../deps.js";
export default class ViewSTD extends GlobalSTD {}
export const dlShareCSS = css`
  :host {
    display: block;
    transition: all 0.3s ease-in-out;
  }

  span {
    display: inline-flex;
    align-items: center;
    flex: 1;
    white-space: nowrap;
  }

  dl {
    height: 100%;
    position: relative;
  }

  dt {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    background: inherit;
    align-items: center;
  }

  * {
    transition: inherit;
  }

  dd {
    overflow: hidden;
    display: grid;
    grid-template-rows: 0fr;
  }

  section {
    min-height: 0;
    overflow: hidden;
  }

  :host([open]) dd {
    grid-template-rows: 1fr;
  }

  :host([float]) dd {
    top: 100%;
    position: absolute;
  }
`;
