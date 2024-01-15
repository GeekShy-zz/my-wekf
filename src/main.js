import inject from './inject.js';
import promise from './promise.js'
import _ from './underscore.m.js';
const wekf = {};
// 注入underscore 里面的所有方法
_.each(_.methods(_), function(key) {
  inject(wekf, key, _[key]);
})
// 注入promise
wekf.promise = promise

// console.log(wekf);
export default wekf;