import _ from './underscore.m.js';

export function inject(ctx, name, val) {
  if (!_.isObject(name)) {
    let key = name;
    name = {};
    name[key] = val;
  }
  _.each(name, (value, key) => {
    if (!_.has(ctx, key)) {
      ctx[key] = value
    }
  });
  
}