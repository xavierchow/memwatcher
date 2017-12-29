'use strict';

const memwatch = require('memwatch-next');
const heapdump = require('heapdump');
const path = require('path');

module.exports = (dumpFileDir) => {
  dumpFileDir = dumpFileDir || '/tmp/';
  if (process.env.MONITOR_MEM === 'yes') {
    console.log('start to monitor memeory leak...');
    memwatch.on('leak', function(info) {
      console.error('Memory leak detected: ', info);
      const file = path.resolve(dumpFileDir, `profile-${process.pid}-${Date.now()}.heapsnapshot`);
      heapdump.writeSnapshot(file, function(err) {
        if (err) {
          return console.error(err);
        }
        console.error('Wrote snapshot: ' + file);
      });
    });
  }
};
