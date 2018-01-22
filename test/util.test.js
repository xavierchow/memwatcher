'use strict'

const { test } = require('ava')
const util = require('../lib/util')

test('should convert numberic', t => {
  const ret = util.convertToBytes(['10m', '20m'])
  t.is(ret.length, 2)
  t.is(ret[0], 10 * 1024 * 1024)
  t.is(ret[1], 20 * 1024 * 1024)
})

test('should support uppercase', t => {
  const ret = util.convertToBytes(['10M', '20M'])
  t.is(ret.length, 2)
  t.is(ret[0], 10 * 1024 * 1024)
  t.is(ret[1], 20 * 1024 * 1024)
})

test('should support numeric', t => {
  const ret = util.convertToBytes([10, 20])
  t.is(ret.length, 2)
  t.is(ret[0], 10)
  t.is(ret[1], 20)
})
