"use client";
import * as React from "react";
import * as X from "../effect/index.js";
import { createComponent } from "@lit/react";
export const OVText = createComponent({
  tagName: "ov-text",
  elementClass: X.OVText,
  react: React,
});
export const OVPort = createComponent({
  tagName: "ov-port",
  elementClass: X.OVPort,
  react: React,
});
export const OVButton = createComponent({
  tagName: "ov-button",
  elementClass: X.OVButton,
  react: React,
});
export const ROPort = createComponent({
  tagName: "ro-port",
  elementClass: X.ROPort,
  react: React,
});
export const TWText = createComponent({
  tagName: "tw-text",
  elementClass: X.TWText,
  react: React,
  events: {
    onChange: "change",
    onDone: "done",
  },
});
