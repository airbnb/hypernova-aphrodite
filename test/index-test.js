import AphroditeComponent from './components/AphroditeComponent';
import { renderReactWithAphrodite } from '../';
import jsdom from 'jsdom';
import { assert } from 'chai';

describe('aphrodite css rendering', () => {
  let result;
  beforeEach(() => {
    result = renderReactWithAphrodite('AC', AphroditeComponent)({
      children: ['Zack'],
      onPress: () => alert('Clicked'),
    });
  });

  it('the markup looks good', () => {
    assert.isString(result);

    assert.ok(/style data-aphrodite/.test(result));
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
