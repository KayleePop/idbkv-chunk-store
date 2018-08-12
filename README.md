# idbkv-chunk-store
[![Greenkeeper badge](https://badges.greenkeeper.io/KayleePop/idbkv-chunk-store.svg)](https://greenkeeper.io/)
[![Travis badge](https://travis-ci.org/KayleePop/idbkv-chunk-store.svg?branch=master)](https://travis-ci.org/#)
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

## Blobs

There's also a new option for get() that allows a Blob to be returned instead of a Buffer.
```js
store.get(0,
  {returnBlob: true}, // default is false to return a Buffer
  (err, blob) => console.log(blob instanceof Blob) // outputs true
)
```

This is beneficial because indexedDB returns a pointer to the data in a stored blob instead of loading it all into memory immediately.

## Compatibility

[idb-kv](https://github.com/kayleepop/idb-kv) uses [async functions](https://caniuse.com/#search=async%20functions), so those need to be supported to use this library.
