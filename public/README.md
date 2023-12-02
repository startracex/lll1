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
