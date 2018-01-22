'use strict'

const { test } = require('ava')
const { StatsEmitter } = require('../lib/stats_emitter')
const EventEmitter = require('events')

class Watcher extends EventEmitter {}
const watcher = new Watcher()

test('should not receive event', t => {
  t.plan(1)
  const emitter = new StatsEmitter(watcher)
  emitter.on('increased', () => {
    t.fail('should not receive event here')
  })
  watcher.emit('stats', { current_base: 15 * 1024 * 1024 } )
  t.pass()
})

test('should receive increased event', t => {
  t.plan(1)
  const emitter = new StatsEmitter(watcher)
  emitter.addThresholds('10m')
  emitter.on('increased', over => {
    t.is(over, '10m')
  })
  watcher.emit('stats', { current_base: 15 * 1024 * 1024 } )
})

test('should receive the exceeded max', t => {
  t.plan(1)
  const emitter = new StatsEmitter(watcher)
  emitter.addThresholds(['10m', '20m'])
  emitter.on('increased', over => {
    t.is(over, '20m')
  })
  watcher.emit('stats', { current_base: 25 * 1024 * 1024 } )
})

test('should ignore the order of addThresholds', t => {
  t.plan(1)
  const emitter = new StatsEmitter(watcher)
  emitter.addThresholds(['20m', '10m'])
  emitter.on('increased', over => {
    t.is(over, '20m')
  })
  watcher.emit('stats', { current_base: 25 * 1024 * 1024 } )
})

test('should not receive the unreached threshold', t => {
  t.plan(1)
  const emitter = new StatsEmitter(watcher)
  emitter.addThresholds(['20m', '10m', '30m'])
  emitter.on('increased', over => {
    t.is(over, '20m')
  })
  watcher.emit('stats', { current_base: 25 * 1024 * 1024 } )
})

test('should receive twice', t => {
  t.plan(2)
  const emitter = new StatsEmitter(watcher)
  emitter.addThresholds(['20m', '10m', '30m'])
  let count = 0
  emitter.on('increased', over => {
    count++
    if (count === 1) {
      return t.is(over, '20m')
    }
    if (count === 2) {
      return t.is(over, '30m')
    }
    t.fail('should not come here')
  })
  watcher.emit('stats', { current_base: 25 * 1024 * 1024 } )
  watcher.emit('stats', { current_base: 35 * 1024 * 1024 } )
})

test('addThreshold should support receive rest parameters', t => {
  t.plan(1)
  const emitter = new StatsEmitter(watcher)
  emitter.addThresholds('10m', '20m', '30m')
  t.deepEqual(emitter.thresholds, ['10m', '20m', '30m'])
})

test('addThreshold should support receive array', t => {
  t.plan(1)
  const emitter = new StatsEmitter(watcher)
  emitter.addThresholds(['10m', '20m', '30m'])
  t.deepEqual(emitter.thresholds, ['10m', '20m', '30m'])
})

