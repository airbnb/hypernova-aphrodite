import jsdom from 'jsdom';
import { assert } from 'chai';
import sinon from 'sinon';
import ReactDOM from 'react-dom';
import ifReact from 'enzyme-adapter-react-helper/build/ifReact';

import AphroditeComponent from './components/AphroditeComponent';
import {
  renderReactWithAphrodite as serverRenderReactWithAphrodite,
  renderReactWithAphroditeStatic as serverRenderReactWithAphroditeStatic,
} from '..';
import {
  renderReactWithAphrodite,
  renderReactWithAphroditeStatic,
} from '../lib/index.browser';

describe('renderReactWithAphrodite aphrodite css rendering', () => {
  let originalWindow;
  let originalDocument;
  let result;

  beforeEach(() => {
    originalWindow = global.window;
    originalDocument = global.document;
    result = serverRenderReactWithAphrodite('AC', AphroditeComponent)({
      children: ['Zack'],
      onPress() { console.log('Clicked'); },
    });
  });

  afterEach(() => {
    global.window = originalWindow;
    global.document = originalDocument;
  });

  it('the markup looks good', () => {
    assert.isString(result);

    assert.ok(/style data-aphrodite/.test(result));
    assert.ok(/Zack/.test(result));
    assert.ok(/data-aphrodite-css/.test(result));
  });

  it('throws when calling renderReactWithAphrodite on the server', () => {
    assert.throws(() => renderReactWithAphrodite('AC', AphroditeComponent)(), 'functionality does not work');
  });

  ifReact('>= 16', it, it.skip)('does not blow up when calling renderReactWithAphrodite on the client', (done) => {
    jsdom.env(result, (err, window) => {
      if (err) {
        done(err);
        return;
      }

      global.window = window;
      global.document = window.document;

      const hydrateMethod = sinon.spy(ReactDOM, 'hydrate');

      renderReactWithAphrodite('AC', AphroditeComponent);

      assert(hydrateMethod.calledOnce);

      delete global.window;
      delete global.document;

      hydrateMethod.restore();

      done();
    });
  });

  it('does not blow up when calling renderReactWithAphrodite on the client (render method)', (done) => {
    jsdom.env(result, (err, window) => {
      if (err) {
        done(err);
        return;
      }

      global.window = window;
      global.document = window.document;

      const sandbox = sinon.createSandbox();
      if (ReactDOM.hydrate) {
        sandbox.stub(ReactDOM, 'hydrate').value(undefined);
      }

      const renderMethod = sinon.spy(ReactDOM, 'render');

      renderReactWithAphrodite('AC', AphroditeComponent);

      assert(renderMethod.calledOnce);

      sandbox.restore();

      delete global.window;
      delete global.document;

      done();
    });
  });
});

describe('renderReactWithAphroditeStatic static aphrodite css rendering', () => {
  let originalWindow;
  let originalDocument;
  let result;

  beforeEach(() => {
    originalWindow = global.window;
    originalDocument = global.document;
    result = serverRenderReactWithAphroditeStatic('AC', AphroditeComponent)({
      children: ['Steven'],
      onPress() {},
    });
  });

  afterEach(() => {
    global.window = originalWindow;
    global.document = originalDocument;
  });

  it('returns nothing', (done) => {
    jsdom.env(result, (err, window) => {
      if (err) {
        done(err);
        return;
      }

      global.window = window;
      global.document = window.document;

      assert.isUndefined(renderReactWithAphroditeStatic('AC', AphroditeComponent));

      done();
    });
  });
});
