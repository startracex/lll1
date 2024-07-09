# Godown

Simple, stylized, semantic web components.

## Install

```sh
npm i godown
```

## Usages

### HTML

```html
<g-alert title="Alert"></g-alert>
```

### JS

```js
// import all
import { Alert } from "godown";

// import one
import Alert from "godown/alert";

const alert = new Alert();
alert.title = "Alert";
/*
const alert = new Alert({
  title: "Alert"
});
 */
document.body.appendChild(alert);
```

deno

```js
import { Alert } from "npm:godown";
```

#### React

```jsx
import { Alert } from "godown/react"; // import all

export default function () {
  return <Alert title="Alert" >;
}
```

## Custom

### Custom element tag name

```js
import { defineConfig } from "godown/conf";

const newNames = {
  "alert": "custom-alert",
};

function getName(raw: string) {
  return this.prefix + newNames[raw];
}

defineConfig({
  tag: getName,
  prefix: "my-",
  suffix: "",
});
```

```html
<my-custom-alert title="Alert"></my-custom-alert>
```

### Custom element styles

Font color and background

```css
* {
  --godown--background-rgb: 12 12 12;
  --godown--foreground-rgb: 240 240 240;
}
```

### Custom CSS variable prefix

```js
import { defineConfig } from "godown/conf";

defineConfig({
  cssvar: "x",
});
```

```html
<g-button style="--x-button--focus-scale: .95;"></g-button>
```

### Custom initial property

All element.

```js
import { defineConfig } from "godown/conf";
defineConfig({
  assign: {
    classList: ["godown-element", "custom-element"],
    color: "blue", // button property
  },
});
```

Assign when elements are **connected**.

```html
<g-button class="godown-element custom-element" color="blue">Button</g-button>

<g-input class="godown-element custom-element" color="blue"></g-input>
```

One element.

```js
const RedButton = new Button({
  classList: ["godown-element", "custom-element"],
});
```

#### With CSS

It can be used to set CSS variables.

```css
.godown-element {
}
```

## Compatibility

Legacy names is now unavailable.

Manually specify the legacy name at `tag`, return a legacy name, see[s](#custom-element-tag-name)

## Development

Install dependencies.

```sh
pnpm install
```

Start development server.

```sh
pnpm run dev
```

Compile and generate publish files.

```sh
pnpm run build
```

Compile and generate minified files.

```sh
pnpm run build:min
```

Generate the component metadata from the files.

```sh
pnpm run meta
```

Synchronize elements exports from metadata.

```sh
pnpm run export
```

Format code.

```sh
pnpm run fmt
```

Lint code.

```sh
pnpm run lint
```

## Publish

Build and publish (executed by workflows).

```sh
pnpm run build

pnpm publish
# or
npm publish ./public
```
