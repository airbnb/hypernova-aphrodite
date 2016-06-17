# hypernova-aphrodite

[Aphrodite](https://github.com/Khan/aphrodite) bindings for [Hypernova](https://github.com/airbnb/hypernova).

## Install

```sh
npm install hypernova-aphrodite
```

## Usage

Here's how use use it in your module:

```js
import { renderReactWithAphrodite } from 'hypernova-aphrodite';
import MyComponent from './src/MyComponent.jsx';

export default renderReactWithAphrodite(
  'MyComponent.hypernova.js', // this file's name (or really any unique name)
  MyComponent,
);
```
