'use strict';

const EventEmitter = require('events')
const { convertToBytes } = require('../lib/util')

class StatsEmitter extends EventEmitter {

  constructor(watcher) {
    super();
    this.thresholds = [];
    this.watcher = watcher;
    watcher.on('stats', info => {
      if (this.thresholds.length === 0) {
        return;
      }
      const numericThresholds = convertToBytes(this.thresholds)
      if (info.current_base <= numericThresholds[0]) {
        return;
      }
      let over;
      while (info.current_base > numericThresholds[0]) {
        numericThresholds.shift(); 
        over = this.thresholds.shift();
        if (numericThresholds.length === 0) {
          break;
        }
      }
      this.emit('increased', over);
    });
  }

  addThresholds(...arr) {
    if (arr.length === 1 && Array.isArray(arr[0])) {
      arr = arr[0]
    }
    this.thresholds = this.thresholds.concat(arr).sort()
  }

}

exports.StatsEmitter = StatsEmitter
