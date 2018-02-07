import jsdom from 'jsdom';
import { assert } from 'chai';

import AphroditeComponent from './components/AphroditeComponent';
import withHOC from './components/withHOC';
import {
  renderReactWithAphrodite,
  renderReactWithAphroditeStatic,
  setRenderEnhancers,
} from '../';

describe('renderReactWithAphrodite aphrodite css rendering', () => {
  let originalWindow;
  let originalDocument;
  let result;

  beforeEach(() => {
    originalWindow = global.window;
    originalDocument = global.document;
    result = renderReactWithAphrodite('AC', AphroditeComponent)({
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

  it('does not blow up when calling renderReactWithAphrodite on the client', (done) => {
    jsdom.env(result, (err, window) => {
      if (err) {
        done(err);
        return;
      }

      global.window = window;
      global.document = window.document;

      renderReactWithAphrodite('AC', AphroditeComponent);

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
    result = renderReactWithAphroditeStatic('AC', AphroditeComponent)({
      children: ['Steven'],
      onPress() {},
    });
  });

  afterEach(() => {
    global.window = originalWindow;
    global.document = originalDocument;
  });

  describe('on the server', () => {
    it('the output contains styles and component content', () => {
      assert.isString(result);

      assert.ok(/style data-aphrodite/.test(result));
      assert.ok(/Steven/.test(result));
    });

    it('the markup does not contain aphrodite-css info for the client', () => {
      assert.isFalse(/data-aphrodite-css/.test(result));
    });
  });

  describe('on the client', () => {
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
});

describe('setRenderEnhancers', () => {
  afterEach(() => {
    setRenderEnhancers(); // reset
  });

  it('works with no enhancers', () => {
    setRenderEnhancers();

    const result = renderReactWithAphrodite('AC', AphroditeComponent)({});

    assert.isString(result);
  });

  it('works with one enhancer', () => {
    const enhancers = [withHOC];
    setRenderEnhancers(...enhancers);

    const result = renderReactWithAphrodite('AC', AphroditeComponent)({});

    assert.isString(result);
    assert.lengthOf(result.match(/class="hoc"/g), enhancers.length);
  });

  it('works with multiple enhancers', () => {
    const enhancers = [withHOC, withHOC, withHOC, withHOC];
    setRenderEnhancers(...enhancers);

    const result = renderReactWithAphrodite('AC', AphroditeComponent)({});

    assert.isString(result);
    assert.lengthOf(result.match(/class="hoc"/g), enhancers.length);
  });

  it('throws when passed enhancers that are not functions', () => {
    const goodEnhancers = [withHOC];
    assert.doesNotThrow(setRenderEnhancers.bind(this, ...goodEnhancers), TypeError);

    const badEnhancers = ['not a function'];
    assert.throws(setRenderEnhancers.bind(this, ...badEnhancers), TypeError);
  });
});
