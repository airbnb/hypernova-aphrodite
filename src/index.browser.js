import React from 'react';
import ReactDOM from 'react-dom';
import hypernova, {
  load,
  fromScript,
} from 'hypernova';
import { StyleSheet } from 'aphrodite';

import { setRenderEnhancers, enhance } from './enhance';

export { setRenderEnhancers };

const returnThrower = () => () => {
  throw new Error('server functionality does not work in browser');
};

export const renderReactWithAphrodite = (name, component) => {
  const enhancedComponent = enhance(component);

  return hypernova({
    server: returnThrower,

    client() {
      const classNames = fromScript({ 'aphrodite-css': name });
      if (classNames) StyleSheet.rehydrate(classNames);

      const payloads = load(name);
      if (payloads) {
        payloads.forEach((payload) => {
          const { node, data } = payload;
          if (node) {
            const element = React.createElement(enhancedComponent, data);
            if (ReactDOM.hydrate) {
              ReactDOM.hydrate(element, node);
            } else {
              ReactDOM.render(element, node);
            }
          }
        });
      }

      return component;
    },
  });
};

export const renderReactWithAphroditeStatic = () => hypernova({
  server: returnThrower,
  client() {},
});
