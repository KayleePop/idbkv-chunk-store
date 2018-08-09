const Idbkv = require('idb-kv')

function noop () {}

module.exports = class {
  constructor (chunkLength, {length = Infinity, name = 'idbkv-chunk-store', batchInterval = 10} = {}) {
    this._idbkvStore = new Idbkv(name, {batchInterval: batchInterval})
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

    this._idbkvStore.set(index, buffer)
      .then(cb) // doesn't resolve with any data
      .catch(cb)
  }
  get (index, opts, cb) {
    if (typeof opts === 'function') return this.get(index, {}, opts)

    this._idbkvStore.get(index)
      .then(uint8Array => {
        if (uint8Array === undefined) {
          return cb(new Error('Index does not exist in storage'))
        }

        // structured clone algorithm stored Buffer as a Uint8Array
        const buffer = Buffer.from(uint8Array)
        const offset = (opts && opts.offset) || 0
        const length = (opts && opts.length) || (buffer.length - offset)
        cb(null, buffer.slice(offset, offset + length))
      })
      .catch(cb)
  }
  close (cb = noop) {
    this._idbkvStore.close()
      .then(cb) // doesn't resolve with any data
      .catch(cb)
  }
  destroy (cb = noop) {
    this._idbkvStore.destroy()
      .then(cb) // doesn't resolve with any data
      .catch(cb)
  }
}
