export function isNil(n: any) {
  // eslint-disable-next-line eqeqeq
  return n == null;
}

export function notNil(n: any) {
  return !isNil(n);
}

export function numerical(n?: string | number) {
  return !isNaN(+n);
}

export function random(m = 0, n = 1) {
  return Math.random() * (n - m) + m;
}

export function joinRules(rules: Record<string, Record<string, string | number>>) {
  return Object.keys(rules).reduce((css, key) => {
    const properties = joinProperties(rules[key]);
    return properties ? css + `${key}{${properties}}` : css;
  }, "");
}

export function joinProperties(prop: Record<string, string | number>) {
  return Object.keys(prop).reduce((css, key) => {
    const value = prop[key];
    return isNil(value) ? css : css + `${key}:${value};`;
  }, "");
}

export function debounce(func: (_: any) => any, timeout: number): () => void {
  let timer: number | null = null;
  return function (this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout) as unknown as number;
  };
}

export function deepQuerySelectorAll<E extends Element = HTMLElement>(
  selectors: string,
  root: E | ParentNode = document.body,
): E[] {
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

export function deepQuerySelector<E extends Element = HTMLElement>(
  selectors: string,
  root: E | ParentNode = document.body,
): E {
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
