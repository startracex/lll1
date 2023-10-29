"use client";
import { createComponent } from "@lit/react";
import * as React from "react";
import * as X from "../effect/index.js";

export const ClipText = createComponent({
  tagName: "clip-text",
  elementClass: X.ClipText,
  react: React,
});

export const OverbreathText = createComponent({
  tagName: "overbreath-text",
  elementClass: X.OverbreathText,
  react: React,
});

export const TypewriterText = createComponent({
  tagName: "typewriter-text",
  elementClass: X.TypewriterText,
  react: React,
});
