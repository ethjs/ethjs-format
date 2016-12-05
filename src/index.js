const schema = require('./schema.json');
const BN = require('bignumber.js');
const toBuffer = require('ethjs-util').toBuffer;
const stripHexPrefix = require('ethjs-util').stripHexPrefix;
const isHexPrefixed = require('ethjs-util').isHexPrefixed;
const arrayContainsArray = require('ethjs-util').arrayContainsArray;
const getBinarySize = require('ethjs-util').getBinarySize;

/**
 * Format quantity values, either encode to hex or decode to BigNumber
 * should intake null, stringNumber, number, BN
 *
 * @method formatQuantity
 * @param {String|BigNumber|Number} value quantity or tag to convert
 * @param {Boolean} encode to hex or decode to BigNumber
 * @returns {Object|String} output to BigNumber or string
 * @throws error if value is a float
 */
function formatQuantity(value, encode) {
  var output = value; // eslint-disable-line

  // if hex string, number string or number, encode into bignumber
  if (typeof value === 'string'
   || typeof value === 'number') {
    if (String(value).indexOf('.') !== -1) {
      throw new Error(`quantity value '${value}' cannot be float`);
    }

    if (String(value).match(/[A-Za-z]/i) || String(value).length === 0) {
      var prepString = `0x${toBuffer(`0x${stripHexPrefix(value)}`).toString('hex')}`;  // eslint-disable-line

      if (prepString === '0x' || prepString === '') {
        prepString = '0x0';
      }

      output = new BN(prepString, 16);
    } else {
      output = new BN(value);
    }
  }

  // encode to BigNumber to hex
  if (typeof output === 'object'
   && value !== null && encode) {
    output = `0x${output.toString(16).toLowerCase()}`;
  }

  return output;
}

/**
 * Format quantity or tag, if tag bypass return, else format quantity
 * should intake null, stringNumber, number, BN, string tag
 *
 * @method formatQuantityOrTag
 * @param {String|BigNumber|Number} value quantity or tag to convert
 * @param {Boolean} encode encode the number to hex or decode to BigNumber
 * @returns {Object|String} output to BigNumber or string
 * @throws error if value is a float
 */
function formatQuantityOrTag(value, encode) {
  var output = value; // eslint-disable-line

  // if the value is a tag, bypass
  if (schema.tags.indexOf(value) === -1) {
    output = formatQuantity(value, encode);
  }

  return output;
}

/**
 * Format object, even with random RPC caviets
 *
 * @method formatObject
 * @param {String|Array} formatter the unit to convert to, default ether
 * @param {Object} value the object value
 * @param {Boolean} encode encode to hex or decode to BigNumber
 * @returns {Object} output object
 * @throws error if value is a float
 */
function formatObject(formatter, value, encode) {
  var output = Object.assign({}, value); // eslint-disable-line
  var formatObject = null; // eslint-disable-line

  // if the object is a string flag, then retreive the object
  if (typeof formatter === 'string') {
    if (formatter === 'Boolean|EthSyncing') {
      formatObject = Object.assign({}, schema.objects.EthSyncing);
    } else if (formatter === 'DATA|Transaction') {
      formatObject = Object.assign({}, schema.objects.Transaction);
    } else {
      formatObject = Object.assign({}, schema.objects[formatter]);
    }
  }

  // check if all required data keys are fulfilled
  if (!arrayContainsArray(Object.keys(value), formatObject.__required)) { // eslint-disable-line
    throw new Error(`object ${JSON.stringify(value)} must contain properties: ${formatObject.__required.join(', ')}`); // eslint-disable-line
  }

  // assume formatObject is an object, go through keys and format each
  Object.keys(value).forEach((valueKey) => {
    output[valueKey] = format(formatObject[valueKey], value[valueKey], encode);
  });

  return output;
}

/**
 * Format array
 *
 * @method formatArray
 * @param {String|Array} formatter the unit to convert to, default ether
 * @param {Object} value the value in question
 * @param {Boolean} encode encode to hex or decode to BigNumber
 * @param {Number} lengthRequirement the required minimum array length
 * @returns {Object} output object
 * @throws error if minimum length isnt met
 */
function formatArray(formatter, value, encode, lengthRequirement) {
  var output = value.slice(); // eslint-disable-line
  var formatObject = formatter; // eslint-disable-line

  // if the formatter is an array or data, then make format object an array data
  if (formatter === 'Array|DATA') {
    formatObject = ['DATA'];
  }

  // if formatter is a FilterChange and acts like a BlockFilter
  // or PendingTx change format object to tx hash array
  if (formatter === 'FilterChange' && typeof value[0] === 'string') {
    formatObject = ['DATA32'];
  }

  // enforce minimum value length requirements
  if (encode === true
    && typeof lengthRequirement === 'number'
    && value.length < lengthRequirement) {
    throw new Error(`array ${JSON.stringify(value)} must contain at least ${lengthRequirement} params, but only contains ${value.length}.`); // eslint-disable-line
  }

  // make new array, avoid mutation
  formatObject = formatObject.slice();

  // assume formatObject is an object, go through keys and format each
  value.forEach((valueKey, valueIndex) => {
    // use key zero as formatter for all values, unless otherwise specified
    var formatObjectKey = 0; // eslint-disable-line

    // if format array is exact, check each argument against formatter argument
    if (formatObject.length > 1) {
      formatObjectKey = valueIndex;
    }

    output[valueIndex] = format(formatObject[formatObjectKey], valueKey, encode);
  });

  return output;
}

/**
 * FormatData under strict conditions hex prefix
 *
 * @method formatData
 * @param {String} value the bytes data to be formatted
 * @param {Number} byteLength the required byte length (usually 20 or 32)
 * @returns {String} output output formatted data
 * @throws error if minimum length isnt met
 */
function formatData(value, byteLength) {
  var output = value; // eslint-disable-line
  var outputByteLength = 0; // eslint-disable-line

  // prefix only under strict conditions, else bypass
  if (typeof value === 'string'
    && value !== null
    && isHexPrefixed(value) === false) {
    output = `0x${value}`;
  }

  if (typeof value === 'string') {
    outputByteLength = getBinarySize(output);
  }

  // throw if bytelength is not correct
  if (typeof byteLength === 'number'
    && value !== null && output !== '0x' // support empty values
    && (!/^[A-Za-z0-9]+$/.test(output) || outputByteLength !== 2 + byteLength * 2)) {
    throw new Error(`hex string '${output}' must be an alphanumeric ${2 + byteLength * 2} utf8 byte string, is ${outputByteLength} bytes`);
  }

  return output;
}

/**
 * Format various kinds of data to RPC spec or into digestable JS objects
 *
 * @method format
 * @param {String|Array} formatter the data formatter
 * @param {String|Array|Object|Null|Number} value the data value input
 * @param {Boolean} encode encode to hex or decode to BigNumbers, Strings, Booleans, Null
 * @param {Number} lengthRequirement the minimum data length requirement
 * @throws error if minimum length isnt met
 */
function format(formatter, value, encode, lengthRequirement) {
  var output = value; // eslint-disable-line

  // if formatter is quantity or quantity or tag
  if (formatter === 'QUANTITY') {
    output = formatQuantity(value, encode);
  } else if (formatter === 'QUANTITY|TAG') {
    output = formatQuantityOrTag(value, encode);
  } else if (formatter === 'DATA') {
    output = formatData(value); // dont format data flagged objects like compiler output
  } else if (formatter === 'DATA20') {
    output = formatData(value, 20); // dont format data flagged objects like compiler output
  } else if (formatter === 'DATA32') {
    output = formatData(value, 32); // dont format data flagged objects like compiler output
  } else {
    // if value is an object or array
    if (typeof value === 'object'
      && value !== null
      && Array.isArray(value) === false) {
      output = formatObject(formatter, value, encode);
    } else if (Array.isArray(value)) {
      output = formatArray(formatter, value, encode, lengthRequirement);
    }
  }

  return output;
}

/**
 * Format RPC inputs generally to the node or TestRPC
 *
 * @method formatInputs
 * @param {Object} method the data formatter
 * @param {Array} inputs the data inputs
 * @returns {Array} output the formatted inputs array
 * @throws error if minimum length isnt met
 */
function formatInputs(method, inputs) {
  return format(schema.methods[method][0], inputs, true, schema.methods[method][2]);
}

/**
 * Format RPC outputs generally from the node or TestRPC
 *
 * @method formatOutputs
 * @param {Object} method the data formatter
 * @param {Array|String|Null|Boolean|Object} outputs the data inputs
 * @returns {Array|String|Null|Boolean|Object} output the formatted data
 */
function formatOutputs(method, outputs) {
  return format(schema.methods[method][1], outputs, false);
}

// export formatters
module.exports = {
  schema,
  formatQuantity,
  formatQuantityOrTag,
  formatObject,
  formatArray,
  format,
  formatInputs,
  formatOutputs,
};
