import { createComponent, EventName, Options, ReactWebComponent } from "@lit/react";
import type GodownElement from "../godown-element.js";
import * as React from "react";

export const create = <
  /**/
  I extends HTMLElement,
  E extends Record<string, EventName | string> = NonNullable<unknown>,
>(
  /**/
  option: Partial<Options<I, E>>,
  ns: typeof React = React,
): ReactWebComponent<I, E> => {
  option.tagName = option.tagName || (option.elementClass as unknown as typeof GodownElement)?.elementTagName || option.elementClass.name;
  return createComponent<I, E>({
    ...(option as Options<I, E>),
    react: ns,
  });
};

export default create;
