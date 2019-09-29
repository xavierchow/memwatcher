'use strict';


const leaker = require('./fixture/leaker')
const watcher = require('../index')
const test = require('ava')
const fs = require('fs')

test.cb(t => {
  const dumpFile = '/tmp/test.heapsnapshot'
  process.env.MONITOR_MEM = 'on'
  const opt = {
    dumpFileDir: dumpFile,
    callback: () => {
      t.true(fs.existsSync(dumpFile))
      t.end()
    }
  }
  watcher(opt);
  leaker.start();
});

