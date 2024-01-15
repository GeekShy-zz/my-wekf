function deferred() {
  const dfd = {};
  const promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  dfd.promise = promise;
  return dfd;
}

export default {
  defer: deferred
}
