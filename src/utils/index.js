const assert = require('assert');

// methods taken from ethereumjs-util

/**
 * Returns a `Boolean` on whether or not the a `String` starts with "0x"
 * @param {String} str
 * @return {Boolean}
 */
exports.isHexPrefixed = function (str) {
  return str.slice(0, 2) === '0x';
};

/**
 * Removes "0x" from a given `String`
 * @param {String} str
 * @return {String}
 */
exports.stripHexPrefix = function (str) {
  if (typeof str !== 'string') {
    return str;
  }
  return exports.isHexPrefixed(str) ? str.slice(2) : str;
};

/**
 * Pads a `String` to have an even length
 * @param {String} a
 * @return {String}
 */
exports.padToEven = function (a) {
  if (a.length % 2) a = '0' + a;
  return a;
};

/**
 * Converts a `Number` into a hex `String`
 * @param {Number} i
 * @return {String}
 */
exports.intToHex = function (i) {
  assert(i % 1 === 0, 'number is not a integer');
  assert(i >= 0, 'number must be positive');
  var hex = i.toString(16);
  if (hex.length % 2) {
    hex = '0' + hex;
  }

  return '0x' + hex;
};

/**
 * Converts an `Number` to a `Buffer`
 * @param {Number} i
 * @return {Buffer}
 */
exports.intToBuffer = function (i) {
  var hex = exports.intToHex(i);
  return Buffer.from(hex.slice(2), 'hex');
};

/**
 * Attempts to turn a value into a `Buffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.
 * @param {*} v the value
 */
exports.toBuffer = function (v) {
  if (!Buffer.isBuffer(v)) {
    if (Array.isArray(v)) {
      v = Buffer.from(v);
    } else if (typeof v === 'string') {
      if (exports.isHexPrefixed(v)) {
        v = Buffer.from(exports.padToEven(exports.stripHexPrefix(v)), 'hex');
      } else {
        v = Buffer.from(v);
      }
    } else if (typeof v === 'number') {
      v = exports.intToBuffer(v);
    } else if (v === null || v === undefined) {
      v = Buffer.allocUnsafe(0);
    } else if (v.toArray) {
      // converts a BN to a Buffer
      v = Buffer.from(v.toArray());
    } else {
      throw new Error('invalid type');
    }
  }
  return v;
};

/**
 * Returns TRUE if the first specified array contains all elements
 * from the second one. FALSE otherwise.
 *
 * @param {array} superset
 * @param {array} subset
 *
 * @returns {boolean}
 */
exports.arrayContainsArray = function (superset, subset) {
  return subset.every(function (value) {
    return (superset.indexOf(value) >= 0);
  });
};
