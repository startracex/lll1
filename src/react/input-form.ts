"use client";
import * as React from "react";
import * as X from "../input-form/index.js";
import { createComponent } from "@lit-labs/react";
const stdevent = {
  onInput: "input",
  onChange: "change",
};
export const BaseForm = createComponent({
  tagName: "base-form",
  elementClass: X.BaseForm,
  react: React,
});
export const BaseInput = createComponent({
  tagName: "base-input",
  elementClass: X.BaseInput,
  react: React,
  events: stdevent,
});
export const ExpInput = createComponent({
  tagName: "exp-input",
  elementClass: X.ExpInput,
  react: React,
  events: stdevent,
});
export const LabelInput = createComponent({
  tagName: "label-input",
  elementClass: X.LabelInput,
  react: React,
  events: stdevent,
});
export const SearchInput = createComponent({
  tagName: "search-input",
  elementClass: X.SearchInput,
  react: React,
  events: stdevent,
});
export const SearchW = createComponent({
  tagName: "search-w",
  elementClass: X.SearchW,
  react: React,
});
export const SelectInput = createComponent({
  tagName: "select-input",
  elementClass: X.SelectInput,
  react: React,
  events: stdevent,
});
export const SignForm = createComponent({
  tagName: "sign-form",
  elementClass: X.SignForm,
  react: React,
});
export const SplitInput = createComponent({
  tagName: "split-input",
  elementClass: X.SplitInput,
  react: React,
  events: stdevent,
});
export const SwitchInput = createComponent({
  tagName: "switch-input",
  elementClass: X.SwitchInput,
  react: React,
  events: stdevent,
});
