const Idbkv = require('idb-kv')
const blobToBuffer = require('blob-to-buffer')

function noop () {}

module.exports = class IdbkvChunkStore {
  constructor (chunkLength, { length = Infinity, name = 'idbkv-chunk-store', batchInterval = 10 } = {}) {
    this._idbkvStore = new Idbkv(name, { batchInterval: batchInterval })
    this.chunkLength = chunkLength

    if (length !== Infinity) {
      this.lastChunkLength = (length % this.chunkLength) || this.chunkLength
      this.lastChunkIndex = Math.ceil(length / this.chunkLength) - 1 // subtract 1 because it's a 0 based index
    }
  }

  put (index, buffer, cb = noop) {
    if (index === this.lastChunkIndex) {
      if (buffer.length !== this.lastChunkLength) {
        return cb(new Error(`Last chunk's length must be ${this.lastChunkLength}`))
      }
    } else {
      if (buffer.length !== this.chunkLength) {
        return cb(new Error(`Chunk length must be ${this.chunkLength}`))
      }
    }

    // store buffers as blobs to allow partial lookups without loading the entire chunk into memory
    // indexedDB returns a pointer to the data in a blob instead of loading it into memory immediately
    const blob = new window.Blob([buffer], {type: 'application/octet-stream'})

    this._idbkvStore.set(index, blob)
      .then(cb) // doesn't resolve with any data
      .catch(cb)
  }

  get (index, opts, cb) {
    if (typeof opts === 'function') return this.get(index, {}, opts)

    this._idbkvStore.get(index)
      .then(blob => {
        if (blob === undefined) {
          return cb(new Error('Index does not exist in storage'))
        }

        const offset = (opts && opts.offset) || 0
        const length = (opts && opts.length) || (blob.size - offset)

        blob = blob.slice(offset, offset + length)

        if (opts && opts.returnBlob) {
          cb(null, blob)
        } else {
          blobToBuffer(blob, cb)
        }
      })
      .catch(cb)
  }

  close (cb = noop) {
    this._idbkvStore.db
      .then((db) => {
        db.close()
        cb()
      })
      .catch(cb)
  }

  destroy (cb = noop) {
    this._idbkvStore.destroy()
      .then(cb) // doesn't resolve with any data
      .catch(cb)
  }
}
