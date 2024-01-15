import inject from './inject';
import _ from './underscore.m';
const wekf = {};
// 注入underscore 里面的所有方法
_.each(_.methods(_), function(value, key) {
  inject(wekf, key, value);
})
export default wekf;