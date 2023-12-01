import { createComponent, EventName, Options, ReactWebComponent } from "@lit/react";
import conf from "../conf.js";
import * as React from "react";

export const create = <
  /**/
  I extends HTMLElement,
  E extends Record<string, EventName | string> = NonNullable<unknown>,
>(
  /**/
  option: Omit<Options<I, E>, "react">,
  ns: typeof React = React,
): ReactWebComponent<I, E> => {
  option.tagName = conf.namemap.get(option.tagName) || option.tagName;
  return createComponent<I, E>({
    ...option,
    react: ns,
  });
};

export default create;
