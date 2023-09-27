"use client";
import * as React from "react";
import * as X from "../layout/index.js";
import { createComponent } from "@lit-labs/react";
export const NavLayout = createComponent({
  tagName: "nav-layout",
  elementClass: X.NavLayout,
  react: React
});
export const AsideNav = createComponent({
  tagName: "nav-aside",
  elementClass: X.NavAside,
  react: React
});
export const DivLine = createComponent({
  tagName: "div-line",
  elementClass: X.DivLine,
  react: React
});
export const FlexFlow = createComponent({
  tagName: "flex-flow",
  elementClass: X.FlexFlow,
  react: React
});
export const DragBox = createComponent({
  tagName: "drag-box",
  elementClass: X.DragBox,
  react: React
});
