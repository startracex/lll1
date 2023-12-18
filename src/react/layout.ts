"use client";
import createComponent from "./create.js";
import * as X from "../layout/index.js";

export const DivLine = createComponent({
  tagName: "div-line",
  elementClass: X.DivLine,
});

export const DragBox = createComponent({
  tagName: "drag-box",
  elementClass: X.DragBox,
});

export const FlexFlow = createComponent({
  tagName: "flex-flow",
  elementClass: X.FlexFlow,
});

export const NavAside = createComponent({
  tagName: "nav-aside",
  elementClass: X.NavAside,
});

export const NavLayout = createComponent({
  tagName: "nav-layout",
  elementClass: X.NavLayout,
});

export const SkeletonScreen = createComponent({
  tagName: "skeleton-screen",
  elementClass: X.SkeletonScreen,
});

export const WithWrap = createComponent({
  tagName: "with-wrap",
  elementClass: X.WithWrap,
});
