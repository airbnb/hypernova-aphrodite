import React from 'react';

export default function withHOC(Component) {
  return props => (
    <div className="hoc">
      <Component {...props} />
    </div>
  );
}
