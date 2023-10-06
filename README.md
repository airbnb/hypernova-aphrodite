| :exclamation: Deprecation Notice |
|:-|
|We want to express our sincere gratitude for your support and contributions to the Hypernova open source project. As we are no longer using this technology internally, we have come to the decision to archive the Hypernova repositories. While we won't be providing further updates or support, the existing code and resources will remain accessible for your reference. We encourage anyone interested to fork the repository and continue the project's legacy independently. Thank you for being a part of this journey and for your patience and understanding.|
---

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
