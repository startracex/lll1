export function debounce(func: (_: any) => any, timeout: number): () => void {
  let timer: number | null = null;
  return function (this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export function deepQuerySelectorAll<E extends Element = HTMLElement>(selectors: string, root: E | ParentNode = document.body): E[] {
  const result: E[] = [];

  if (!root || !selectors) {
    return result;
  }

  if ((root as E).shadowRoot) {
    result.push(...deepQuerySelectorAll<E>(selectors, (root as E).shadowRoot));
  }

  const a = root.querySelectorAll<E>(selectors);
  result.push(...Array.from(a));

  for (const child of root.children) {
    result.push(...deepQuerySelectorAll<E>(selectors, child));
  }

  return [...new Set(result)];
}

export function deepQuerySelector<E extends Element = HTMLElement>(selectors: string, root: E | ParentNode = document.body): E {
  if (!root || !selectors) {
    return null;
  }
  if ((root as E).shadowRoot) {
    return deepQuerySelector<E>(selectors, (root as E).shadowRoot);
  }
  const a = root.querySelector<E>(selectors);
  if (a) {
    return a;
  }
  for (const child of root.children) {
    const b = deepQuerySelector<E>(selectors, child);
    if (b) {
      return b;
    }
  }
  return null;
}

export function each(node: Node, callback: (node: Node) => void) {
  if (node) {
    callback(node);
    for (const i of node.childNodes) {
      each(i, callback);
    }
  }
}

export function random(m = 0, n = 1) {
  return Math.random() * (n - m) + m;
}

/**
 * Create element from args append to target.
 * @param target Appended target element, target or document.querySelector(target) or document.body.
 * @param args Arguments
 */
export function append(target: string | HTMLElement = document.body, args: string | EleArgs | HTMLElement) {
  if (!(target instanceof HTMLElement)) {
    target = (document.querySelector(target) || document.body) as HTMLElement;
  }
  target.appendChild(create(args));
}

/**
 * Create element from args.
 * @param args Arguments.
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
 * Replace elements.
 * @param matched Elements.
 * @param args Arguments.
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

/**
 * tag: tag name. \
 * props: attribute. \
 * children: appended chindren.
 */
interface EleArgs {
  tag: string;
  props?: Record<string, any>;
  children?: (string | HTMLElement | EleArgs)[];
}

/**
 * @param vars CSS properties key array.
 * @param selectorProperties Keys: selector. values: CSS properties value array.
 * @param selectorFunc Change to a a new selector.
 * @param propertyFunc Form key and value into new key:value; pairs.
 * @returns CSS text
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

/**
 * Can be a string.
 */
export interface LikeString {
  toString(): string;
}

export function dashToCamel(str: string, upperFirst = true) {
  str = str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  return upperFirst ? str[0].toUpperCase() + str.slice(1) : str;
}

export function camelToDash(str: string) {
  return (
    str[0].toLowerCase() +
    str
      .slice(1)
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()
  );
}
