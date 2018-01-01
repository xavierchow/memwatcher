'use strict';


const leaker = require('./leaker')
const watcher = require('./index')
const test = require('ava')
const fs = require('fs')

test.cb(t => {
  const dumpFile = '/tmp/test.heapsnapshot'
  process.env.MONITOR_MEM = 'yes'
  watcher(dumpFile, () => {
    t.true(fs.existsSync(dumpFile))
    t.end()
  });
  leaker.start();
});

