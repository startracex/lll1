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

export function deepQuerySelectorAll<E extends Element = HTMLElement>(selectors: string, ignore: Set<string> | Map<string, any>, root: ParentNode = document): E[] {
  return [...root.querySelectorAll<E>(selectors)].reduce((result, a) => {
    if (a.shadowRoot && ignore && !ignore.has(selectors)) {
      return result.concat(deepQuerySelectorAll<E>(selectors, ignore, a.shadowRoot));
    } else {
      return result.concat(a);
    }
  }, []);
}

export function deepQuerySelector<E extends Element>(selectors: string, ignore: Set<string> | Map<string, any>, root: ParentNode = document): E | null {
  const a = root.querySelector<E>(selectors);
  if (a?.shadowRoot && ignore && !ignore.has(selectors)) {
    return deepQuerySelector<E>(selectors, ignore, a.shadowRoot);
  }
  return a;
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
