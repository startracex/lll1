import { css, define, html, property } from "../deps.js";
import STD from "./std.js";
const theme = css`
:host{
  --ov-text:aliceblue;
  --ov-border: 0.275em;
  --ov-port:#1a1a1a;
  --ov-1-1:#AE0CA5;--ov-1-2:#FFD802;
  --ov-2-1:#1fe173;--ov-2-2:#582bca;
  --ov-3-1:#00b4f0;--ov-3-2:#e614e6;
  --ov-deg:60deg;
  --ov-1:linear-gradient(var(--ov-deg),var(--ov-1-1),var(--ov-1-2));
  --ov-2:linear-gradient(var(--ov-deg),var(--ov-2-1),var(--ov-2-2));
  --ov-3:linear-gradient(var(--ov-deg),var(--ov-3-1),var(--ov-3-2));
}
.overbreathflow {
  animation: 8s linear infinite breathflow;
  height: 100%;
  width: 100%;
  position: absolute;
  border-radius: inherit;
}
@keyframes breathflow {
  0%,
  100% {
    opacity: 1;
    background-image: var(--ov-1);
  }
  33.33% {
    opacity: 1;
    background-image: var(--ov-2);
  }
  16.66%,
  50.33%,
  83% {
    opacity: 0;
  }
  66.67% {
    opacity: 1;
    background-image: var(--ov-3);
  }
}`;
@define("ov-text")
export class OVText extends STD {
  static styles = [theme, css`:host{
    display:flex;
    margin:auto;
    width:fit-content;
    font-size:clamp(4.4rem,9vw,5rem);
    align-items: center;
}
@media screen and (max-width:1280px) {
:host {
  flex-direction: column;
}
}
*::selection{
  background: none;
}
.overbreath {
  font-size: inherit;
  padding-bottom: 1rem;
  display: flex;
  align-items: inherit;
  flex-direction: inherit;
}
.overbreathpart {
    line-height: 1;
    position: relative;
}
.overbreathroot {
    color: currentColor;
    position: absolute;
    top: 0;
}
.overbreathtext,
.overbreathroot {
    white-space: nowrap;
    box-sizing: border-box;
    padding-right: 2.5px;
    letter-spacing: -2.5px;
    width: fit-content;
    background-clip: text;
    -webkit-background-clip: text;
    font-weight: 800;
    font-size: inherit;
}
.overbreathtext {
    box-sizing: border-box;
    -webkit-text-fill-color: transparent;
}
.overbreathpart:nth-child(1) .overbreathtext {
    animation: overbreathtext1 8s infinite;
    background-image: var(--ov-1);
}
.overbreathpart:nth-child(2) .overbreathtext {
    animation: 8s ease 0s infinite normal none running overbreathtext2;
    background-image: var(--ov-2);
}
.overbreathpart:nth-child(3) .overbreathtext {
    animation: 8s ease 0s infinite normal none running overbreathtext3;
    background-image: var(--ov-3);
}
.overbreathpart:nth-child(1) .overbreathroot {
    animation: overbreath1 8s infinite;
}
.overbreathpart:nth-child(2) .overbreathroot {
    animation: overbreath2 8s infinite;
}
.overbreathpart:nth-child(3) .overbreathroot {
    animation: overbreath3 8s infinite;
}
@keyframes overbreathtext1 {
    0%,
    16.667%,
    to {
        opacity: 1;
    }
    33.333%,
    83.333% {
        opacity: 0;
    }
}
@keyframes overbreathtext2 {
    0%,
    to {
        opacity: 0;
    }
    33.333%,
    50% {
        opacity: 1;
    }
    16.667%,
    66.667% {
        opacity: 0;
    }
}
@keyframes overbreathtext3 {
    0%,
    50%,
    to {
        opacity: 0;
    }
    66.667%,
    83.333% {
        opacity: 1;
    }
}
@keyframes overbreath1 {
    0%,
    16.667%,
    to {
        opacity: 0;
    }
    25%,
    91.667% {
        opacity: 1;
    }
}
@keyframes overbreath2 {
    0%,
    to {
        opacity: 1;
    }
    33.333%,
    50% {
        opacity: 0;
    }
    25%,
    58.333% {
        opacity: 1;
    }
}
@keyframes overbreath3 {
    0%,
    58.333%,
    91.667%,
    to {
        opacity: 1;
    }
    66.667%,
    83.333% {
        opacity: 0;
    }
}`
  ];
  @property() t1 = `t1 unset.`;
  @property() t2 = `t2 unset..`;
  @property() t3 = `t3 unset...`;
  render() {
    return html`<div class="overbreath"><span class="overbreathpart"><span class="overbreathroot">${this.t1}</span><span class="overbreathtext">${this.t1}</span></span><span class="overbreathpart"><span class="overbreathroot">${this.t2}</span><span class="overbreathtext">${this.t2}</span></span><span class="overbreathpart"><span class="overbreathroot">${this.t3}</span><span class="overbreathtext">${this.t3}</span></span></div>`;
  }
}
@define("ov-port")
export class OVPort extends STD {
  static styles = [theme, css`:host{
  z-index: 1;
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  overflow: hidden;
}
.overbreathflow{
  z-index: -1;
}`
  ];
  render() {
    return html`<div class="overbreathflow"></div><slot></slot>`;
  }
}
@define("ov-button")
export class OVButton extends STD {
  static styles = [theme, css`:host{
  display: inline-block;
  width: fit-content;
  height: fit-content;
  background: var(--ov-port);
  color:var(--ov-text);
  border-radius: .375em;
  font-size: 1em;
}
.overbreathboard{
  color:currentColor;
  background:inherit;
  border-radius: inherit;
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
}
button{
  font-size: inherit;
  color:currentColor;
  background:inherit;
  width: 100%;
  margin: var(--ov-border);
  position: relative;
  z-index: 1;
  border: 0;
  border-radius: inherit;
}`
  ];
  render() {
    return html`<div class="overbreathboard"><div class="overbreathflow"></div><button><slot></slot></button></div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "ov-text": OVText;
    "ov-port": OVPort;
    "ov-button": OVButton;
  }
}