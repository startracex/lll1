"use client";
import createComponent from "./create.js";
import * as X from "../items/index.js";

export const AlertItem = createComponent({
  tagName: "alert-item",
  elementClass: X.AlertItem,
});

export const AvatarAnchor = createComponent({
  tagName: "avatar-a",
  elementClass: X.AvatarAnchor,
});

export const BaseButton = createComponent({
  tagName: "base-button",
  elementClass: X.BaseButton,
});

export const CardItem = createComponent({
  tagName: "card-item",
  elementClass: X.CardItem,
});

export const DialogItem = createComponent({
  tagName: "dialog-item",
  elementClass: X.DialogItem,
});

export const LinkAnchor = createComponent({
  tagName: "link-a",
  elementClass: X.LinkAnchor,
});

export const LoadTrack = createComponent({
  tagName: "load-track",
  elementClass: X.LoadTrack,
});

export const SuperAnchor = createComponent({
  tagName: "super-a",
  elementClass: X.SuperAnchor,
});

export const TimeBar = createComponent({
  tagName: "time-bar",
  elementClass: X.TimeBar,
});
