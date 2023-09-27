# Godown

The **simple, sylized, semantic components** for standard HTML and other frameworks.

## Install

```sh
npm i godown
```

## Useages

html

```html
<alert-item title="Alert"></alert-item>
```

js

```js
import { AlertItem } from "godown";
const item = new AlertItem();
item.title = "Alert";
document.body.appendChild(item);
```

react

```jsx
import { AlertItem } from "godown/react";
export default function () {
  return <AlertItem title="Alert" />;
}
```
