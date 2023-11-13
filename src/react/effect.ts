"use client";
import createComponent from "./create.js";
import * as X from "../effect/index.js";

export const ClipText = createComponent({
  tagName: "clip-text",
  elementClass: X.ClipText,
});

export const OverbreathText = createComponent({
  tagName: "overbreath-text",
  elementClass: X.OverbreathText,
});

export const TypewriterText = createComponent({
  tagName: "typewriter-text",
  elementClass: X.TypewriterText,
});
