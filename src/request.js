import _ from './underscore.m.js'
import native from './native.js'
const MAX_REQUEST = 10;
const pending = [];
const running = [];

function add(payLoad) {
  pending.push(payLoad);
}

function resolve(requestObj, func, params) {
  const indexRun = running.indexOf(requestObj);
  if (indexRun >= 0) {
    running.splice(indexRun, 1);
  }
  if (_.isFunction(func)) {
    func.apply(null, params);
  }
  next();
}

function next() {
  if (pending.length === 0) return;
  if (running.length < MAX_REQUEST) {
    const currenTask = pending.shift();
    const originSuccess = currenTask.success;
    const originFail = currenTask.fail;
    currenTask.success = (...args) => {
      resolve(currenTask, originSuccess, args)
    }
    currenTask.fail = (...args) => {
      resolve(currenTask, originFail, args)
    }
    running.push(currenTask);
    native.request(currenTask);
  }
}

export default function request(obj = {}) {
  obj = _.isString(obj) ? { url: obj } : obj;
  add(obj);
  next()
}