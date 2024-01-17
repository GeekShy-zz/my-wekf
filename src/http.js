import _ from './underscore.m.js'
import promise from './promise.js'
import request from './request.js'

let initOptions = {
  dataType: '',
  responseType: '',
  headers: {
    'content-type': 'application/json'
  },
  onResolve(res) {
    return {
      success: true,
      data: res
    }
  },
  onBeforeRequest(obj) {
    return obj
  }
}

// 返回结果封装
function resolvePromise(deferred, res, fail) {
  let success = !fail;
  if (success && res) {
    const resolveRes = initOptions.onResolve(res);
    if (resolveRes) {
      data = resolveRes.data;
      success = resolveRes.success
    } else {
      success = false
    }
  } else {
    success = false
  }
  if (success) {
    deferred.resolve(data)
  } else {
    deferred.reject(null);
  }
}

export function ajax(method, url, params = {}, ext = {}) {
  const deferred = promise.defer();
  let obj = {
    ext,
    url,
    data: params,
    method: method.toUpperCase(),
    success(res) {
      resolvePromise(deferred, res, false)
    },
    fail(res) {
      resolvePromise(deferred, res, true)
    }
  }
  obj = {...obj, ...initOptions};
  // 请求封装
  initOptions.onBeforeRequest(obj)
  // 附加随机数
  if (obj.url.indexOf('?') >= 0) {
    obj.url += '&_t=' + Math.random();
  } else {
    obj.url += '?_t=' + Math.random();
  }
  request(obj);

  return deferred.promise;
}

export function init(options) {
  if (_.isEmpty(options)) return;
  initOptions = {...initOptions, ...options}
}