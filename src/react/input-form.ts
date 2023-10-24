"use client";
import { createComponent } from "@lit/react";
import * as React from "react";
import * as X from "../input-form/index.js";

const commonEvents = {
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
  events: commonEvents,
});

export const LabelInput = createComponent({
  tagName: "label-input",
  elementClass: X.LabelInput,
  react: React,
  events: commonEvents,
});

export const SearchInput = createComponent({
  tagName: "search-input",
  elementClass: X.SearchInput,
  react: React,
  events: commonEvents,
});

export const SelectInput = createComponent({
  tagName: "select-input",
  elementClass: X.SelectInput,
  react: React,
  events: commonEvents,
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
  events: commonEvents,
});

export const SwitchInput = createComponent({
  tagName: "switch-input",
  elementClass: X.SwitchInput,
  react: React,
  events: commonEvents,
});
