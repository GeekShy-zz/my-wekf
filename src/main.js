
import _ from './underscore.m';
const wekf = {};
// 注入underscore 里面的所有方法
_.each(_.methods(_), function(key) {
  wekf[key] = value;
})
export default wekf;