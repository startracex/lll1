"use client";
import createComponent from "./create.js";
import * as X from "../input-form/index.js";

const commonEvents = {
  onInput: "input",
  onChange: "change",
};

export const BaseForm = createComponent({
  elementClass: X.BaseForm,
});

export const BaseInput = createComponent({
  elementClass: X.BaseInput,
  events: commonEvents,
});

export const LabelInput = createComponent({
  elementClass: X.LabelInput,
  events: commonEvents,
});

export const SearchInput = createComponent({
  elementClass: X.SearchInput,
  events: commonEvents,
});

export const SelectInput = createComponent({
  elementClass: X.SelectInput,
  events: commonEvents,
});

export const SignForm = createComponent({
  elementClass: X.SignForm,
});

export const SplitInput = createComponent({
  elementClass: X.SplitInput,
  events: commonEvents,
});

export const SwitchInput = createComponent({
  elementClass: X.SwitchInput,
  events: commonEvents,
});
