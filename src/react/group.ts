"use client";
import { createComponent } from "@lit/react";
import * as React from "react";
import * as X from "../group/index.js";

export const AvatarGroup = createComponent({
  tagName: "avatar-group",
  elementClass: X.AvatarGroup,
  react: React,
});

export const DetailsGroup = createComponent({
  tagName: "details-group",
  elementClass: X.DetailsGroup,
  react: React,
});
