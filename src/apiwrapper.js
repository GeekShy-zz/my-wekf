import _ from './underscore.m.js'
import preloader from './preloader.js'
// 对API进行包装，实现预加载
export function createWrapper(func, keyPrefix) {
  const isFunc = _.isFunction(func);
  if (!isFunc) throw new Error('func need a function')
  if (!keyPrefix) throw new Error('keyPrefix need a value')
  return createTarget(func, keyPrefix);
}

function createTarget(func, keyPrefix) {
  const target = function () {
    const key = createKey(keyPrefix);
    return preloader.getPreload(key);
  }
  target.preload = createPreload(func, keyPrefix)
  target._ori = func;
  target._prefix = keyPrefix;
  return target;
}

function createPreload(func, keyPrefix) {
  return function() {
    const args = _.toArray(arguments);
    const promise = func.apply(null, args);
    const key = createKey(args, keyPrefix);
    // 预加载
    preloader.preload(key, promise)
  }
}

function createKey(args, keyPrefix) {
  const args_str = [];
  _.each(args, function(param) {
    args_str.push(param);
  })
  if (args_str.length === 0) {
    args_str = ['-'];
  }
  args_str.splice(0, 0, keyPrefix);
  return args_str.join('_');
}

export default {
  'createWrapper': createWrapper
}