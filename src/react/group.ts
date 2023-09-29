"use client";
import * as React from "react";
import * as X from "../group/index.js";
import { createComponent } from "@lit-labs/react";
export const AvatarGroup = createComponent({
  tagName: "avatar-group",
  elementClass: X.AvatarGroup,
  react: React,
});
export const ButtonGroup = createComponent({
  tagName: "button-group",
  elementClass: X.ButtonGroup,
  react: React,
});
export const DetailsGroup = createComponent({
  tagName: "details-group",
  elementClass: X.DetailsGroup,
  react: React,
});
