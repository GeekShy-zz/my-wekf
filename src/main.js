import _ from './underscore.m.js';
import inject from './inject.js';
import promise from './promise.js'
import native from './native.js';
import { watch, unwatch, dispatch } from './watcher.js'  
const wekf = {};
// 注入underscore 里面的所有方法
_.each(_.methods(_), function(key) {
  inject(wekf, key, _[key]);
})
// 注入promise
wekf.promise = promise
// 注入native
wekf.wx = native;
// 注入watcher
wekf.watch = watch;
wekf.unwatch = unwatch;
wekf.dispatch = dispatch;
export default wekf;