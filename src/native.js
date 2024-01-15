import _ from './underscore.m.js'
let myNative = {}

function noop() {
  return {};
}

if (typeof wx === 'object') {
  myNative = wx;
}

if(!_.isUndefined(Proxy)) {
  myNative = new Proxy({}, {
    get(target, property, receiver) {
      let res = myNative[property];
      if (_.isUndefined(res)) {
        res = noop();
      }
      return res;
    }
  })
};

export default myNative;