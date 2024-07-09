export function factory(
  tag: string | typeof fragment,
  props?: null | Record<string, any>,
  ...children: any[]
): HTMLElement;

export function factory<T extends typeof HTMLElement>(
  tag: string | T,
  props?: null | (Partial<Record<keyof T, T[keyof T]>> & Record<string, any>),
  ...children: any[]
): InstanceType<T>;

export function factory<T extends typeof HTMLElement>(
  tag: string | typeof fragment | T,
  props?: null | Record<string, any> | (Partial<Record<keyof T, T[keyof T]>> & Record<string, any>),
  ...children: any[]
) {
  let element: HTMLElement;
  if (typeof tag === "string") {
    element = document.createElement(tag);
  } else if (tag.prototype instanceof HTMLElement) {
    element = new (tag as T)();
  } else if (typeof tag === "function") {
    return (tag as typeof fragment)(props, children);
  }
  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      if (key === "style") {
        Object.assign(element.style, value);
      } else if (key === "class") {
        element.className = value;
      } else if (key.startsWith("on") && key.length > 2) {
        const type = key.slice(2);
        if (type) {
          element.addEventListener(type.toLowerCase(), value);
        }
      } else {
        if (key.startsWith("data-") || Object.prototype.hasOwnProperty.call(element, key)) {
          element.setAttribute(key, value);
        } else {
          element[key] = value;
        }
      }
    });
  }
  children.forEach((child) => {
    append(element, child);
  });

  return element;
}

export function fragment(_: any, ...children: any[]) {
  return children;
}

function append(parent: HTMLElement, child: Node | string) {
  if (Array.isArray(child)) {
    child.forEach((nestedChild) => append(parent, nestedChild));
  } else {
    parent.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
}
