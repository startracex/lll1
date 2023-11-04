import { conf } from "./conf.js";

export const define = (name: string, options?: ElementDefinitionOptions) => (constructor: CustomElementConstructor) => {
  const tagName = conf.tag(name);
  if (!tagName) {
    return;
  }
  if (customElements.get(tagName) === undefined) {
    customElements.define(tagName, constructor, options);
    conf.enabled.add(name);
    conf.namemap.set(name, tagName);
  }
};

/**
 * Create element from args append to target
 * @param target Appended target element, target or document.querySelector(target) or document.body
 * @param args tag: tag name, props: attribute, children: appended chindren
 */
export function append(target: string | HTMLElement = document.body, args: string | EleArgs | HTMLElement) {
  if (!(target instanceof HTMLElement)) {
    target = (document.querySelector(target) || document.body) as HTMLElement;
  }
  target.appendChild(create(args));
}

/**
 * Create element from args
 * @param args tag: tag name, props: attribute, children: appended chindren
 */
export function create(args: string | EleArgs | HTMLElement): HTMLElement {
  if (args instanceof HTMLElement) {
    return args;
  }
  const { tag, props, children } = (typeof args === "string" ? { tag: args } : args) as EleArgs;
  const newElement = document.createElement(tag);
  if (props) {
    Object.keys(props).forEach((prop) => {
      newElement.setAttribute(prop, props[prop] === true ? "" : props[prop]);
    });
  }
  if (children && Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        newElement.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        newElement.appendChild(child);
      } else {
        newElement.appendChild(create(child));
      }
    });
  }
  return newElement;
}

/**
 * Replace elements
 * @param matched
 * @param args
 */
export function retag(matched: HTMLElement[], args: string | EleArgs | HTMLElement) {
  for (let i = matched.length - 1; i >= 0; i--) {
    const element = matched[i];
    const newElement = create(args);
    for (let i = 0; i < element.attributes.length; i++) {
      const attribute = element.attributes[i];
      if (!newElement.hasAttribute(attribute.name)) {
        newElement.setAttribute(attribute.name, attribute.value);
      }
    }
    newElement.innerHTML = element.innerHTML;
    element.parentNode?.replaceChild(newElement, element);
  }
}

interface EleArgs {
  tag: string;
  props?: Record<string, any>;
  children?: (string | HTMLElement | EleArgs)[];
}

/**
 * @param vars css properties key array
 * @param selectorProperties keys: raw name, as selector. values: css properties value array
 * @param selectorFunc change raw name to a new selector
 * @param propertyFunc form key and value into new key:value; pairs.
 * @returns css text
 */
export function constructCSS(vars: LikeString[], selectorProperties: Record<string, LikeString[]>, selectorFunc?: (raw: LikeString) => string, propertyFunc?: (k: LikeString, v: LikeString) => string) {
  let cssString = "";
  Object.keys(selectorProperties).forEach((sel) => {
    const classProperties = vars.map((propertyKey, index) => {
      const propertyValue = selectorProperties[sel][index];
      if (propertyValue === undefined || propertyValue === null) {
        return null;
      }
      if (propertyFunc) {
        return propertyFunc(propertyKey as string, propertyValue as string);
      }
      return `${propertyKey}:${propertyValue}`;
    });
    const filtedProperties = classProperties.filter((p) => p);
    if (selectorFunc) {
      sel = selectorFunc(sel);
    }
    cssString = `${cssString}${sel}{${filtedProperties.join(";")}}`;
  });
  return cssString;
}

interface LikeString {
  toString(): string;
}
