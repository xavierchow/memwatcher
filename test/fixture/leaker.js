'use strict';

const arr = [];
const push = function () {
  arr.push(new Array(100000).join('*'));
};

let timer;
exports.start = function () {
  timer = setInterval(push, 10);
}
exports.stop = function () {
  if (timer) {
    clearInterval(timer);
  }
}
