import _ from './underscore.m.js';

export default function(ctx, name, val) {
  if (name === _.noop()) throw new Error('注入不能为空');
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