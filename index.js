'use strict';

const memwatch = require('memwatch-next');
const heapdump = require('heapdump');
const path = require('path');

module.exports = (dumpFileDir, cb) => {
  cb = cb || function() {};
  dumpFileDir = dumpFileDir || '/tmp/';
  let file;
  if (!dumpFileDir.match(/.*\/$/)) {
    file = dumpFileDir;
  }
  if (process.env.MONITOR_MEM === 'yes') {
    console.log('start to monitor memeory leak...');

    memwatch.on('leak', function(info) {
      console.error('Memory leak detected: ', info);
      file = file || path.resolve(dumpFileDir, `profile-${process.pid}-${Date.now()}.heapsnapshot`);
      heapdump.writeSnapshot(file, function(err) {
        if (err) {
          console.error(err);
          return cb(err);  
        }
        console.error('Wrote snapshot: ' + file);
        cb();
      });
    });
  }
};
