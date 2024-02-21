# Godown

Simple, stylized, semantic web components.

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
import { AlertItem } from "godown/react.js";

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

## Publish

```sh
pnpm run build

pnpm publish
# or
npm publish ./public
```
