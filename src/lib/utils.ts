export function debounce(func: (_: any) => any, timeout: number) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, arguments);
    }, timeout);
  };
}

export function deepQuerySelectorAll<E extends Element = HTMLElement>(selectors: string, root: E | ParentNode = document): E[] {
  if (!root || !selectors) {
    return [];
  }
  let a: E[];
  if ((root as E).shadowRoot) {
    a = [...deepQuerySelectorAll<E>(selectors, (root as E).shadowRoot)];
  } else {
    a = [...root.querySelectorAll<E>(selectors)];
  }
  for (const child of root.children) {
    a.push(...deepQuerySelectorAll<E>(selectors, child));
  }
  return a;
}

export function deepQuerySelector<E extends Element = HTMLElement>(selectors: string, root: E | ParentNode = document): E {
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

export function doAssign(source: any, target: any) {
  const classList = "classList";
  if (classList in source) {
    source[classList] = [...target[classList], ...source[classList]];
  }
  Object.assign(target, source);
}
