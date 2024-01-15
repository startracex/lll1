"use client";
import createComponent from "./create.js";
import * as X from "../group/index.js";

export const AvatarGroup = createComponent({
  tagName: "avatar-group",
  elementClass: X.AvatarGroup,
});

export const DetailsGroup = createComponent({
  tagName: "details-group",
  elementClass: X.DetailsGroup,
});

export const TabGroup = createComponent({
  tagName: "tab-group",
  elementClass: X.TabGroup,
});
