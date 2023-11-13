"use client";
import createComponent from "./create.js";
import * as X from "../input-form/index.js";

const commonEvents = {
  onInput: "input",
  onChange: "change",
};

export const BaseForm = createComponent({
  tagName: "base-form",
  elementClass: X.BaseForm,
});

export const BaseInput = createComponent({
  tagName: "base-input",
  elementClass: X.BaseInput,
  events: commonEvents,
});

export const LabelInput = createComponent({
  tagName: "label-input",
  elementClass: X.LabelInput,
  events: commonEvents,
});

export const SearchInput = createComponent({
  tagName: "search-input",
  elementClass: X.SearchInput,
  events: commonEvents,
});

export const SelectInput = createComponent({
  tagName: "select-input",
  elementClass: X.SelectInput,
  events: commonEvents,
});

export const SignForm = createComponent({
  tagName: "sign-form",
  elementClass: X.SignForm,
});

export const SplitInput = createComponent({
  tagName: "split-input",
  elementClass: X.SplitInput,
  events: commonEvents,
});

export const SwitchInput = createComponent({
  tagName: "switch-input",
  elementClass: X.SwitchInput,
  events: commonEvents,
});
