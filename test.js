const test = require('tape')
const IdbkvChunkStore = require('./index.js')
const abstractTests = require('abstract-chunk-store/tests')

abstractTests(test, IdbkvChunkStore)

function createCleanStore (chunkLength, opts, cb) {
  const store = new IdbkvChunkStore(chunkLength, opts)
  store.destroy(() => cb(new IdbkvChunkStore(chunkLength, opts)))
}

test('Data should persist when using the same name option', (t) => {
  const buffer = Buffer.from('0123456789')
  createCleanStore(10, {name: 'persist-test'}, (store) => {
    store.put(0, buffer, () => {
      const store2 = new IdbkvChunkStore(10, {name: 'persist-test'})
      store2.get(0, (err, storedBuffer) => {
        t.error(err)
        t.deepEquals(storedBuffer, buffer)
        t.end()
      })
    })
  })
})

test('Get should return instances of Buffer', (t) => {
  createCleanStore(10, {name: 'buffer-test'}, (store) => {
    store.put(0, Buffer.from('0123456789'), (err) => {
      t.error(err)
      store.get(0, (err, buffer) => {
        t.error(err)
        t.ok(buffer instanceof Buffer)
        t.end()
      })
    })
  })
})

// immediate-chunk-store calls get(index, null, cb)
test('Calling get() with null for opts does not throw exception', (t) => {
  const buffer = Buffer.from('0123456789')
  createCleanStore(10, {name: 'null-test'}, (store) => {
    store.put(0, buffer, () => {
      const store2 = new IdbkvChunkStore(10, {name: 'null-test'})
      store2.get(0, null, (err, storedBuffer) => {
        t.error(err)
        t.deepEquals(storedBuffer, buffer)
        t.end()
      })
    })
  })
})

test('opts.length should allow partial last chunks', (t) => {
  createCleanStore(10, {name: 'length-test', length: 25}, (store) => {
    const buffer = Buffer.from('01234')
    store.put(2, buffer, (err) => {
      t.error(err)
      store.get(2, (err, storedBuffer) => {
        t.error(err)
        t.deepEquals(storedBuffer, buffer)
        t.end()
      })
    })
  })
})

// test('Specifying a different chunkLength while loading an existing store via the name option should replace it with an empty store that has the new chunkLength', (t) => {
//   createCleanStore(10, {name: 'different-length-test'}, (store) => {
//     store.put(0, '0123456789', () => {
//       const store2 = new IdbkvChunkStore(5, {name: 'different-length-test'})
//       store2.get(0, function (err, chunk) {
//         t.ok(err instanceof Error)
//         t.equals(store2.chunkLength, 5)
//         t.end()
//       })
//     })
//   })
// })
