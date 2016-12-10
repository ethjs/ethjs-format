# User Guide

All information for developers using `ethjs-format` should consult this document.

## Install

```
npm install --save ethjs-format
```

## Usage

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


## Supported RPC Methods

We support all available Ethereum spec RPC methods.

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

Read the full spec here:

https://github.com/ethereum/wiki/wiki/JSON-RPC

## Why BN.js?

`ethjs` has made a policy of using `BN.js` across all of its repositories. Here are some of the reasons why:

  1. lighter than alternatives (BigNumber.js)
  2. faster than most alternatives, see [benchmarks](https://github.com/indutny/bn.js/issues/89)
  3. used by the Ethereum foundation across all [`ethereumjs`](https://github.com/ethereumjs) repositories
  4. is already used by a critical JS dependency of many ethereum packages, see package [`elliptic`](https://github.com/indutny/elliptic)
  5. purposefully **does not support decimals or floats numbers** (for greater precision), remember, the Ethereum blockchain cannot and will not support float values or decimal numbers.

## Browser Builds

`ethjs` provides production distributions for all of its modules that are ready for use in the browser right away. Simply include either `dist/ethjs-format.js` or `dist/ethjs-format.min.js` directly into an HTML file to start using this module. Note, an `ethFormat` object is made available globally.

```html
<script type="text/javascript" src="ethjs-format.min.js"></script>
<script type="text/javascript">
ethFormat(...);
</script>
```

Note, even though `ethjs` should have transformed and polyfilled most of the requirements to run this module across most modern browsers. You may want to look at an additional polyfill for extra support.

Use a polyfill service such as `Polyfill.io` to ensure complete cross-browser support:
https://polyfill.io/

## Latest Webpack Figures

```
Hash: bff3839e979e26b98b3e                                                           
Version: webpack 2.1.0-beta.15
Time: 842ms
              Asset    Size  Chunks             Chunk Names
    ethjs-format.js  170 kB       0  [emitted]  main
ethjs-format.js.map  213 kB       0  [emitted]  main
    + 13 hidden modules

> ethjs-format@0.1.3 build:umd:min /home/nick/github/ethjs-format
> cross-env BABEL_ENV=commonjs NODE_ENV=production webpack --config ./internals/webpack/webpack.config.js ./lib/index.js --progress

Hash: 6530438ecf2a47b0ed05                                                           
Version: webpack 2.1.0-beta.15
Time: 2755ms
              Asset     Size  Chunks             Chunk Names
ethjs-format.min.js  75.4 kB       0  [emitted]  main
    + 13 hidden modules
```

## Other Awesome Modules, Tools and Frameworks

 - [web3.js](https://github.com/ethereum/web3.js) -- the original Ethereum swiss army knife **Ethereum Foundation**
 - [ethereumjs](https://github.com/ethereumjs) -- critical ethereumjs infrastructure **Ethereum Foundation**
 - [browser-solidity](https://ethereum.github.io/browser-solidity) -- an in browser Solidity IDE **Ethereum Foundation**
 - [wafr](https://github.com/silentcicero/wafr) -- a super simple Solidity testing framework
 - [truffle](https://github.com/ConsenSys/truffle) -- a solidity/js dApp framework
 - [embark](https://github.com/iurimatias/embark-framework) -- a solidity/js dApp framework
 - [dapple](https://github.com/nexusdev/dapple) -- a solidity dApp framework
 - [chaitherium](https://github.com/SafeMarket/chaithereum) -- a JS web3 unit testing framework
 - [contest](https://github.com/DigixGlobal/contest) -- a JS testing framework for contracts

## Our Relationship with Ethereum & EthereumJS

 We would like to mention that we are not in any way affiliated with the Ethereum Foundation or `ethereumjs`. However, we love the work they do and work with them often to make Ethereum great! Our aim is to support the Ethereum ecosystem with a policy of diversity, modularity, simplicity, transparency, clarity, optimization and extensibility.

 Many of our modules use code from `web3.js` and the `ethereumjs-` repositories. We thank the authors where we can in the relevant repositories. We use their code carefully, and make sure all test coverage is ported over and where possible, expanded on.
