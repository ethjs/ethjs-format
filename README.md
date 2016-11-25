## ethjs-format

<div>
  <!-- Dependency Status -->
  <a href="https://david-dm.org/SilentCicero/ethjs-format">
    <img src="https://david-dm.org/SilentCicero/ethjs-format.svg"
    alt="Dependency Status" />
  </a>

  <!-- devDependency Status -->
  <a href="https://david-dm.org/SilentCicero/ethjs-format#info=devDependencies">
    <img src="https://david-dm.org/SilentCicero/ethjs-format/dev-status.svg" alt="devDependency Status" />
  </a>

  <!-- Build Status -->
  <a href="https://travis-ci.org/SilentCicero/ethjs-format">
    <img src="https://travis-ci.org/SilentCicero/ethjs-format.svg"
    alt="Build Status" />
  </a>

  <!-- NPM Version -->
  <a href="https://www.npmjs.org/package/ethjs-format">
    <img src="http://img.shields.io/npm/v/ethjs-format.svg"
    alt="NPM version" />
  </a>

  <!-- Javascript Style -->
  <a href="http://airbnb.io/javascript/">
    <img src="https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg" alt="js-airbnb-style" />
  </a>
</div>

<br />

A payload formatter for the Ethereum RPC layer.

## Install

```
npm install --save ethjs-format
```

## Usage

```js
const format = require('ethjs-format');

const inputPayload = format.formatInputs('eth_getBalance', ["0x407d73d8a49eeb85d32cf465507dd71d507100c1", 405938494]);

// result ['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x1832213E']

const outputPayload = format.formatOutputs('eth_getBalance', "0x0234c8a3397aab58");

// result <BigNumber ...>
// result outputPayload.toString(10) 158972490234375000
```

## About

A straight forward and complete RPC formatting layer for the Ethereum RPC spec.

## Encoding/Decoding

`ethjs-format` mainly helps in the process of handling and encoding things like quantities (i.e numbers) either before or after payload transport.

### Quantities

  Will encode quantities such as: `BigNumber`, `'string nums'`, `numbers` into hex. Decodes hex numbers into `BigNumber` objects. Very much like web3.js.

### Data

  Will very carefully prefix unprefixed data such as `{data: ''}` to `{data: '0x'}` for encoding. Otherwise does nothing to DATA typed fields in or out. 32 and 20 byte data requirements are enforced across all incoming and outgoing payloads, however `0x` empty data is allowed.

### Objects

  Will encode complex RPC objects like the `eth_sendTransaction` input object structure `{from: ..., data: ..., gas: ...}` for RPC payloads. For complex objects, it also enforces by `throw` required fields such as `from` and `data` for the `eth_sendTransaction` input object.

  ```js
  const format = require('ethjs-format');

  const inputPayload = format.formatInputs('eth_sendTransaction', [{
    "from": "0xb60e8dd61c5d32be8058bb8eb970870f07233155",
    "to": "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
    "gas": new BigNumber("30400"), // 30400,
    "gasPrice": "10000000000000", // 10000000000000
    "value": 2441406250, // 2441406250
    "data": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"
  }]);

  /* result

  [{
    from: '0xb60e8dd61c5d32be8058bb8eb970870f07233155',
    to: '0xd46e8dd67c5d32be8058bb8eb970870f07244567',
    gas: '0x76c0',
    gasPrice: '0x9184e72a000',
    value: '0x9184e72a',
    data: '0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675'
  }]
  */

  const outputPayload = format.formatOutputs('eth_sendTransaction', "0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331");

  // result "0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331"
  ```

## Methods Supported

```
web3_clientVersion
web3_sha3
net_version
net_peerCount
net_listening
eth_protocolVersion
eth_syncing
eth_coinbase
eth_mining
eth_hashrate
eth_gasPrice
eth_accounts
eth_blockNumber
eth_getBalance
eth_getStorageAt
eth_getTransactionCount
eth_getBlockTransactionCountByHash
eth_getBlockTransactionCountByNumber
eth_getUncleCountByBlockHash
eth_getUncleCountByBlockNumber
eth_getCode
eth_sign
eth_sendTransaction
eth_sendRawTransaction
eth_call
eth_estimateGas
eth_getBlockByHash
eth_getBlockByNumber
eth_getTransactionByHash
eth_getTransactionByBlockHashAndIndex
eth_getTransactionByBlockNumberAndIndex
eth_getTransactionReceipt
eth_getUncleByBlockHashAndIndex
eth_getUncleByBlockNumberAndIndex
eth_getCompilers
eth_compileLLL
eth_compileSolidity
eth_compileSerpent
eth_newFilter
eth_newBlockFilter
eth_newPendingTransactionFilter
eth_uninstallFilter
eth_getFilterChanges
eth_getFilterLogs
eth_getLogs
eth_getWork
eth_submitWork
eth_submitHashrate
db_putString
db_getString
db_putHex
db_getHex
shh_post
shh_version
shh_newIdentity
shh_hasIdentity
shh_newGroup
shh_addToGroup
shh_newFilter
shh_uninstallFilter
shh_getFilterChanges
shh_getMessages
```

## Contributing

Please help better the ecosystem by submitting issues and pull requests to default. We need all the help we can get to build the absolute best linting standards and utilities. We follow the AirBigNumberB linting standard. Please read more about contributing to `ethjs-format` in the `CONTRIBUTING.md`.

<!--
## Guides

You'll find more detailed information on using default and tailoring it to your needs in our guides:

- [User guide](docs/user-guide.md) - Usage, configuration, FAQ and complementary tools.
- [Developer guide](docs/developer-guide.md) - Contributing to wafr and writing your own plugins & formatters.
-->

## Help out

There is always a lot of work to do, and will have many rules to maintain. So please help out in any way that you can:

<!-- - Create, enhance, and debug rules (see our guide to ["Working on rules"](./github/CONTRIBUTING.md)). -->
- Improve documentation.
- Chime in on any open issue or pull request.
- Open new issues about your ideas for making stylelint better, and pull requests to show us how your idea works.
- Add new tests to *absolutely anything*.
- Create or contribute to ecosystem tools, like the plugins for Atom and Sublime Text.
- Spread the word.

Please consult our [Code of Conduct](CODE_OF_CONDUCT.md) docs before helping out.

We communicate via [issues](https://github.com/SilentCicero/ethjs-format/issues) and [pull requests](https://github.com/SilentCicero/ethjs-format/pulls).

## Important documents

- [Changelog](CHANGELOG.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [License](https://raw.githubusercontent.com/SilentCicero/ethjs-format/master/LICENSE)

## Licence

This project is licensed under the MIT license, Copyright (c) 2016 Nick Dodson. For more information see LICENSE.md.

```
The MIT License

Copyright (c) 2016 Nick Dodson. nickdodson.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
