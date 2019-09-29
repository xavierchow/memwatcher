'use strict';

const memwatch = require('node-memwatch');
const heapdump = require('heapdump');
const path = require('path');
const { StatsEmitter } = require('./lib/stats_emitter')
const debug = require('debug')('memwatcher')

module.exports = (options) => {
  options = options || {}
  const callback = options.callback || function() {}
  const dumpFileDir = options.dumpFileDir || '/tmp/'
  let file
  if (!dumpFileDir.match(/.*\/$/)) {
    file = dumpFileDir
  }
  if (process.env.MONITOR_MEM === 'off') {
    return
  }
  console.log('start to monitor memeory leak...')

  memwatch.on('leak', function(info) {
    console.error('Memory leak detected: ', info)
    file = file || path.resolve(dumpFileDir, `profile-${process.pid}-${Date.now()}.heapsnapshot`)
    heapdump.writeSnapshot(file, function(err) {
      if (err) {
        console.error(err)
        return callback(err)
      }
      console.error('Wrote snapshot: ' + file)
      callback()
    })
  })

  if (process.env.STATS_DUMP === 'off') {
    return
  }
  if (!options.thresholds) {
    return
  }

  const emitter = new StatsEmitter(memwatch)
  emitter.addThresholds(options.thresholds)
  emitter.on('increased', over => {
    console.log('stats-event-heapTotal %d', Math.floor(process.memoryUsage().heapTotal / (1024 * 1024)))
    console.log('stats-event-heapUsed %d', Math.floor(process.memoryUsage().heapUsed / (1024 * 1024)))
    const statsDumpFile = `/tmp/stats-profile-${over}-${process.pid}-${Date.now()}.heapsnapshot`
    console.error(`Memory stats updated exceeds ${over}`);
    return heapdump.writeSnapshot(statsDumpFile, function(err) {
      if (err) {
        console.error(err)
        return callback(err)
      }
      console.error('Wrote snapshot: ' + statsDumpFile)
      callback()
    })
  })
}
