# idbkv-chunk-store
[![Node.js CI](https://github.com/KayleePop/idbkv-chunk-store/workflows/Node.js%20CI/badge.svg)](https://github.com/KayleePop/idbkv-chunk-store/actions)
[![standard badge](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm](https://img.shields.io/npm/v/idbkv-chunk-store.svg)](https://www.npmjs.com/package/idbkv-chunk-store)

Abstract chunk store implementation built on [idb-kv](https://github.com/kayleepop/idb-kv): a small IndexedDB wrapper that automatically batches for performance.

[![abstract chunk store](https://cdn.rawgit.com/mafintosh/abstract-chunk-store/master/badge.svg)](https://github.com/mafintosh/abstract-chunk-store)

## Install

```
npm install idbkv-chunk-store
```

## Usage

See [abstract-chunk-store](https://github.com/mafintosh/abstract-chunk-store)

``` js
var IdbkvChunkStore = require('idbkv-chunk-store')
var store = new IdbkvChunkStore(10,
  {
    name: 'example', // data will persist to future instances with this same name Default='idbkv-chunk-store'
    length: 37, // allows partial final chunks Default=Infinity
    batchInterval: 10 // sets batch interval for idb-kv Default=10ms
  }
)

store.put(0, Buffer.from('0123456789'), (err) => {
  if (err) throw err
  store.get(0, (err, chunk) => {
    if (err) throw err
    console.log(chunk) // outputs '0123456789' as a buffer
  })
})
```

## Compatibility

[idb-kv](https://github.com/kayleepop/idb-kv) uses [async functions](https://caniuse.com/#search=async%20functions), so those need to be supported to use this library.
