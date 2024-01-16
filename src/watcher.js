import _ from './underscore.m.js'

// 事件管理
let handlers = {};

export function watch(eventName, handler, context = null) {
  if (!_.isFunction(handler)) {
    throw new Error('handler must be a function');
  }
  handler = handler.bind(context);
  const eventCollection = handlers[eventName] || [];
  eventCollection.push(handler);
  handlers[eventName] = eventCollection;
}

export function unwatch(eventName, handler = null) {
  if (!_.isFunction(handler)) {
    delete handlers[eventName]
  } else {
    const eventCollection = handlers[eventName];
    handlers[eventName] = _.filter(eventCollection, function(func) {
      return func.name !== handler.name
    })
  }
}

export function dispatch(eventName, ...data) {
  if (!handlers[eventName]) {
    throw new Error('eventName not exist');
  }
  const eventCollection = handlers[eventName];
  _.each(eventCollection, function(func){
    func.apply(null, data);
  })
}