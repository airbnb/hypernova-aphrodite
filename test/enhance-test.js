import { assert } from 'chai';

import withHOC from './components/withHOC';
import AphroditeComponent from './components/AphroditeComponent';
import { setRenderEnhancers } from '../lib/enhance';
import { renderReactWithAphrodite } from '..';

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
