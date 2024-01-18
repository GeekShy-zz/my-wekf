import inject from './inject.js'
import _ from './underscore.m';
let app = null;

class WePage {
  constructor() {
    if(!app) {
      app = getApp();
    }
    this.$app = app;
  }
}

const pageHolder = {};

const pageInjects = {
  $getParams: function(url) {
    let res = {};
    let index = url.indexOf('?');
    if (index !== -1) {
      let str = url.substr(index + 1);
      let tmp;
      str.split('&').forEach(v => {
        tmp = v.split('=');
        res[tmp[0]] = decodeURIComponent(tmp[1] || '');
      });
    }
    return res;
  },
  $resolvePath: function(route, url) {
    if (!url)
      return route;
    if (url[0] === '/') {
      url = url.substr(1);
      return this.$resolvePath('', url);
    }
    if (url[0] !== '.') {
      return this.$resolvePath(route, './' + url);
    }
    let current = route.split('/');
    if (url[0] === '.' && url[1] === '/') {
      url = url.substr(2);
      if (url[0] !== '.') {
        if (current.length)
          current[current.length - 1] = url;
        else
          current = [url];
        return current.length === 1 ? ('/' + current[0]) : current.join('/');
      }
      return this.$resolvePath(current.join('/'), url);
    }
    if (url[0] === '.' && url[1] === '.' && url[2] === '/') {
      url = url.replace(/^\.*/ig, '');
      current.pop();
      return this.$resolvePath(current.join('/'), '.' + url);
    }
    if (url[0] === '.') {
      return this.$resolvePath(route, url.substr(1));
    }
  },
  $route:function(type, url, params = {}) {
    if (_.isString(url)) {
      let s = url + '?';
      _.each(params, function (k) {
        s += `${k}=${params[k]}&`
      });
      s = s.substring(0, s.length - 1);
      url = { url: s };
    } else {
      params = this.$getParams(url.url);
    }
    if (_.isFunction(this.onRouteAway)) {
      this.onRouteAway(type, url, params);
    }
    return native[type](url);
  },
  $redirectTo: function(url, params) {
    return this.$route('redirectTo', url, params);
  },
  $navigateTo: function(url, params) {
    return this.$route('navigateTo', url, params);
  },
  $switchTab: function(url) {
    if (typeof (url) === 'string')
      url = { url: url };

    return native.switchTab(url);
  },
  $navigateBack: function(delta) {
    let p = delta || {};
    if (typeof (p) === 'number')
      p = { delta: p };

    if (!p.delta)
      p.delta = 1;

    return native.navigateBack(p);
  },
  $parse: function(json, defaultVal) {
    let res = defaultVal;
    try {
      res = JSON.parse(json);
    }
    catch (e) { }
    return res;
  },
  $set: function(ctx, path, val) {
    if (!_.isString(path) || !_.isObject(ctx)) return;
    let key = path.replace(/\[(\w+)\]/g, '.$1');
    key = key.replace(/^\./, '');
    let arr = key.split('.')
    for (let i = 0, count = arr.length; i < count; i++) {
      let p = arr[i];
      if (p in ctx) {
        if (i === count - 1) {
          ctx[p] = val;
        } else {
          ctx = ctx[p];
        }
      } else {
        return;
      }
    }
  },
  $get: function(ctx, path, defaultVal) {
    let res = defaultVal;
    if (!_.isString(path) || !_.isObject(ctx)) return res;
    let key = path.replace(/\[(\w+)\]/g, '.$1');
    key = key.replace(/^\./, '');
    let arr = key.split('.')
    for (let i = 0, count = arr.length; i < count; i++) {
      let p = arr[i];
      if (p in ctx) {
        ctx = ctx[p];
      } else {
        return res;
      }
    }
    res = ctx;
    return res;
  },
  $detect: function(ctx, path, func) {
    let res = false;
    let val = this.$get(ctx, path);
    if (_.isFunction(func)) {
      res = func.call(this, val);
    }
    return res;
  }
};

function createPage(pageClass) {
  const pageOptions = new pageClass();
  // 获取原形对象上的属性
  deepExpand(pageOptions);
  // 注入方法
  inject(pageOptions, pageHolder, pageInjects)
  // 声明周期封装
  wrappLifeMethod(pageOptions)
  Page(pageOptions);
}

function mixinPage(mixins) {
  inject(pageHolder, mixins);
}

function wrappLifeMethod(pageOptions) {
  const pageLifecycle = {
    onLoad: (fn) => function(...arg) {
      let tmpArgs = injectService(this, 'onLoad', arg);
      if (tmpArgs) {
        wrapFn(fn).call(this, ...tmpArgs);
      } else {
        wrapFn(fn).call(this, ...arg);
      }
    },
    onReady: (fn) => function (...arg) {
      let tmpArgs = injectService(this, 'onReady', arg);
      if (tmpArgs) {
        wrapFn(fn).call(this, ...tmpArgs);
      } else {
        wrapFn(fn).call(this, ...arg);
      }
    },
    onShow: (fn) => function (...arg) {
      let tmpArgs = injectService(this, 'onShow', arg);
      if (tmpArgs) {
        wrapFn(fn).call(this, ...tmpArgs);
      } else {
        wrapFn(fn).call(this, ...arg);
      }
    },
    onUnload: (fn) => function (...arg) {
      let tmpArgs = injectService(this, 'onUnload', arg);
      if (tmpArgs) {
        wrapFn(fn).call(this, ...tmpArgs);
      } else {
        wrapFn(fn).call(this, ...arg);
      }
    },
    onHide: (fn) => function (...arg) {
      let tmpArgs = injectService(this, 'onHide', arg);
      if (tmpArgs) {
        wrapFn(fn).call(this, ...tmpArgs);
      } else {
        wrapFn(fn).call(this, ...arg);
      }
    },
    onReachBottom: (fn) => function (...arg) {
      let tmpArgs = injectService(this, 'onReachBottom', arg);
      if (tmpArgs) {
        wrapFn(fn).call(this, ...tmpArgs);
      } else {
        wrapFn(fn).call(this, ...arg);
      }
    }
  };
  _.each(pageLifecycle, function(one, key) {
    let fn = _.isFunction(pageOptions[key]) ? pageOptions[key] : _.noop;
    pageOptions[key] = one(fn);
  });
}

function wrapFn(fn) {
  let res = fn;
  if (!_.isFunction(fn)) {
    res = _.noop;
  }
  return res;
}

function deepExpand(obj) {
  const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(obj));
  _.each(keys, function(key) {
    obj[key] = obj[key]
  })
}

export default {
  'WePage': WePage,
  'createPahe': createPage,
  'mixinPage': mixinPage
}