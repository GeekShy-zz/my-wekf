import promise from "./promise.js";

const runningTask = {};
const completeTask = {};

// 预加载
function preload(key, task) {
  runningTask[key] = task;
  task.then(
    (data) => {
      completeTask[key] = { success: true, data: data };
      delete runningTask[key];
    },
    (data) => {
      completeTask[key] = { success: false, data: data };
      delete runningTask[key];
    }
  );
}

function getPreload(key) {
  if (completeTask[key]) {
    // 已执行完成
    return completeTask[key];
  } else if (runningTask[key]) {
    // 执行中
    const deferred = promise.defer();
    const promise = deferred.promise;
    const task = runningTask[key];
    task.then(
      (data) => {
        delete runningTask[key];
        deferred.resolve(data);
      },
      (data) => {
        delete runningTask[key];
        deferred.reject(data);
      }
    );
    return promise;
  } else {
    throw new Error("current task not exist");
  }
}

// 预加载队列
// function preloadQueue(tasks) {
//   try {
//     if (!Array.isArray(tasks) || tasks.length <= 0) return;
//     for (let i = 0; i < tasks.length; i++) {
//       const currentTask = tasks[i];
//     }
//   } catch(e) {
//     console.log(e);
//   }
// }

export default {
  preload: preload,
  getPreload: getPreload,
  preloadQueue: preloadQueue,
};
