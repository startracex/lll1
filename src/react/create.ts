import conf from "../conf.js";
import { createComponent } from "@lit/react";
import * as React from "react";

export const create = (option: Omit<Parameters<typeof createComponent>[0], "react">) => {
  option.tagName = conf.namemap.get(option.tagName) || option.tagName;
  return createComponent({
    ...option,
    react: React,
  });
};

export default create;
