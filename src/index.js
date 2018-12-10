import React from 'react';
import ReactDOMServer from 'react-dom/server';
import hypernova, {
  serialize,
  toScript,
} from 'hypernova';
import { StyleSheetServer } from 'aphrodite';

import { setRenderEnhancers, enhance } from './enhance';

export { setRenderEnhancers };

const thrower = () => {
  throw new Error('client functionality does not work on server');
};

export const renderReactWithAphrodite = (name, component) => {
  const enhancedComponent = enhance(component);
  return hypernova({
    server() {
      return (props) => {
        const { html, css } = StyleSheetServer.renderStatic(() => {
          const element = React.createElement(enhancedComponent, props);
          return ReactDOMServer.renderToString(element);
        });

        const style = `<style data-aphrodite="data-aphrodite">${css.content}</style>`;
        const markup = serialize(name, html, props);
        const classNames = toScript({ 'aphrodite-css': name }, css.renderedClassNames);

        return `${style}\n${markup}\n${classNames}`;
      };
    },

    client: thrower,
  });
};

export const renderReactWithAphroditeStatic = (name, component) => {
  const enhancedComponent = enhance(component);
  return hypernova({
    server() {
      return (props) => {
        const { html, css } = StyleSheetServer.renderStatic(() => {
          const element = React.createElement(enhancedComponent, props);
          return ReactDOMServer.renderToStaticMarkup(element);
        });

        const style = `<style data-aphrodite="data-aphrodite">${css.content}</style>`;

        return `${style}\n${html}`;
      };
    },

    client: thrower,
  });
};
