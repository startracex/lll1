IconWrapper for [F7](https://framework7.io/icons/).

## Usage

### HTML custom element

```js
import "@godown/f7-icon";
```

```html
<f7-icon name="airplane"></f7-icon>
<f7-icon icon="airplane"></f7-icon>
```

### Template result of lit-html 

```js
import { html } from "lit"
import Airplane from "@godown/f7-icon/icons/airplane.js";

html`
  ${Airplane()}
  ${Airplane({ /* attributes */ })}
  <svg viewBox="${Airplane.viewBox}" width="1em" height="1em">
    ${Airplane.body}
  </svg>
`;
```

### Rollup virtual plugin

Moving static imports to virtual directory.

```js
import virtualIcon from "@godown/f7-icon/lib/rollup.js";

export default {
  input: "src/index.js",
  output: {
    dir: "output",
    format: "esm"
    virtualDirname: "virtual",
  },
  plugins: [
    virtualIcon(),
  ],
};
```

### Type help

#### Node 16 Resolution

package.json exports

#### Triple-Slash Directives

```ts
/// <reference types="@godown/f7-icon/types/all.d.ts"/>
```

### Icon size

Width and height defaults to 1em.

font-size or width and height can change the icon's size.

```html
<f7-icon name="airplane" style="font-size:2em;"></f7-icon>
<f7-icon name="airplane" style="width:2em;height:2em;"></f7-icon>
```

### Undefined element

```js
import IconElement from "@godown/f7-icon/element.js";
customElements.define("my-icon", IconElement)
```

```html
<my-icon name="airplane"></my-icon>
```

### Specify the URL

The target module needs to export a function by default.

```js
import F7Icon from "@godown/f7-icon";

const airplane = new F7Icon();
airplane.toURL = function (name: string) {
  return "specified URL or string";
};
```

### Lazy loading

Disable lazy loading:

```html
<f7-icon icon="house" loading="eager"></f7-icon>
```
