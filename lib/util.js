'use strict'

exports.convertToBytes = function(arr) {
  return arr.map(v => {
    if (typeof v !== 'string') {
      return v 
    }
    const matched = v.match(/(\d+)m/i)
    if (matched) {
      return matched[1] * 1024 * 1024
    }
  }) 
}
