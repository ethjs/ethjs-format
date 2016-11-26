# 0.0.6 -- handle BlockFilter and PendingTransactionFilter

1. Handle the bad design caveit of tx or FilterChange result

# 0.0.5 -- minor fix on eth_getCode

1. Minor fix on eth_getCode, requires 1 not 2 param length

# 0.0.4 -- minor fix on eth_txCount..

1. Minor fix on eth_getTransactionCount, required 2 instead of 1..

# 0.0.3 -- enforce input param requirements

1. Enforce input param requirements
2. Ethjs-util integration

# 0.0.2 -- Handle floats with error, switch all bn to BigNumber

1. Handle quantity floats with error (no floats on chain)
2. Switched all bignumbers from `bn.js` to `bignumber.js`
3. Enfore 20 and 32 byte lengths where required, throw if not alphanumeric

# 0.0.1 -- ethjs-formmat

1. Basic testing
2. Basic docs
3. License
