const config = {
  enhancers: [], // HOCs applied to the component before render: e0(e1(e2(...en(component))))
};

export const setRenderEnhancers = (...enhancers) => {
  // Check that all enhancers are functions
  enhancers.forEach((enhancer, index) => {
    if (typeof enhancer !== 'function') {
      throw new TypeError(`enhancers passed to setRenderEnhancer should be functions: ${index}`);
    }
  });

  config.enhancers = enhancers; // clear & set
};

export const enhance = component => config.enhancers.reduceRight((x, f) => f(x), component);
