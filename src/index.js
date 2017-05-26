import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import hypernova, { serialize, load, toScript, fromScript } from 'hypernova';
import { StyleSheet, StyleSheetServer } from 'aphrodite';

/* eslint import/prefer-default-export: 1 */
export const renderReactWithAphrodite = (name, component) => hypernova({
  server() {
    return (props) => {
      const { html, css } = StyleSheetServer.renderStatic(() => (
        ReactDOMServer.renderToString(React.createElement(component, props))
      ));

      // We don't want to serialize the serverOnlyData
      const propsToSerialize = { ...props };
      delete propsToSerialize.serverOnlyData;

      const style = `<style data-aphrodite>${css.content}</style>`;
      const markup = serialize(name, html, propsToSerialize);
      const classNames = toScript({ 'aphrodite-css': name }, css.renderedClassNames);

      return `${style}\n${markup}\n${classNames}`;
    };
  },

  client() {
    const classNames = fromScript({ 'aphrodite-css': name });
    if (classNames) StyleSheet.rehydrate(classNames);

    const payloads = load(name);
    if (payloads) {
      payloads.forEach((payload) => {
        const { node, data } = payload;
        if (node) {
          const element = React.createElement(component, data);
          ReactDOM.render(element, node);
        }
      });
    }

    return component;
  },
});
