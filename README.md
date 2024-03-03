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

Can't use a single tag.

```html
<g-alert title="Alert"/>
<!-- ERROR -->
```

### JS

```js
import { Alert } from "godown"; // import all
// import Alert from "godown/alert"; // import one

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
  return <Alert title="Alert" />;
}
```

## Custom

### Custom element tag name

The name must contain `-`.

```js
import { defineConfig } from "godown/conf";

const newNames = {
  "old-name": "new-name",
};

function getName(constructorDashName: string) {
  return newNames[constructorDashName];
}

defineConfig({
  tag: getName,
  prefix: "prefix-",
  suffix: "",
});
```

The element will be renamed to `${prefix} + ${tag( ${constructorDashName} )} + ${suffix}`

```html
<prefix-new-name title="Alert"></prefix-new-name>
```

### Custom element styles

Font color and background

```css
* {
  --godown--background-rgb: 12 12 12;
  --godown--foreground-rgb: 240 240 240;
}
```

See [With CSS](#with-css).

### Custom element CSS variable prefix

```js
import { defineConfig } from "godown/conf";

defineConfig({
  cssvar: "ge",
});
```

The CSS variable of the element will be `${cssvar} + element name + description`.

The following CSS variables now affect element styles.

```html
<g-button style="--ge--g-button--focus-scale: .95;"></g-button>
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
const RedGhostButton = new Button({
  // ...
  color: "red", // overwrite
  ghost: true, // button property
});
```

#### With CSS

It can be used to set CSS variables.

```css
.godown-element {
  --ge--foreground-rgb: 0 0 0;
  --ge--background-rgb: 255 255 255;
}
```

## Compatibility

```js
import { defineConfig } from "godown/conf";
defineConfig({
  naming: "legacy", // default is "latest"
});
```

Legacy names can now be used.

```html
<base-button>legacy</base-button>
```

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

Synchronize elements export indexes.

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
