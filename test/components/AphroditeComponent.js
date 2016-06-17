import React, { PropTypes } from 'react';
import { css, StyleSheet } from 'aphrodite';

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
  },

  text: {
    color: 'red',
  },
});

export default function Button(props) {
  const { children, onPress } = props;

  return (
    <button
      type="button"
      onClick={onPress}
      className={css(styles.button, styles.text)}
    >
      <span className={css(styles.text)}>
        {children}
      </span>
    </button>
  );
}

Button.propTypes = {
  onPress: PropTypes.func,
  children: PropTypes.node,
};
