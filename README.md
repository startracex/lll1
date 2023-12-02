# Godown

The **simple, stylized, semantic components** for standard HTML and other frameworks.

## Install

```sh
npm i godown
```

## Usages

### HTML

```html
<alert-item title="Alert"></alert-item>
```

### JS

```js
import { AlertItem } from "godown";

const item = new AlertItem();
item.title = "Alert";
document.body.appendChild(item);
```

deno

```ts
import { AlertItem } from "npm:godown";
```

### React

```jsx
import { AlertItem } from "godown/react";

export default function () {
  return <AlertItem title="Alert" />;
}
```

## Development

Install dependencies

```sh
pnpm install
```

Start development server

```sh
pnpm run dev
```

Compile and watch

```sh
pnpm run watch
```

Compile and generate publish files

```sh
pnpm run build
```

Generate minified

```sh
pnpm run roll
```

Synchronize full and usage readme

```sh
pnpm run readme
```

Format code

```sh
pnpm run fmt
```

Lint code

```sh
pnpm run lint
```

## Directory Structure

files

`conf.ts` - global configuration

`deps.ts` - dependencies

`glob.ts` - base element & style

`index.ts` - entry

`tmpl.ts` - templates and icons

`with.ts` - attach utils

directories

`effect` - focus on the effect

`group` - grouped other components

`input-form` - forms and input controls

`items` - individual components or others

`layout` - components that affect the layout

`view` - components for content display

`react` - converted to react components

## Publish

```sh
pnpm run build

npm publish ./public
# or
pnpm publish
```
