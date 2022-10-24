const Thinky = require('thinky')
const { rethinkdb } = require('./config')

module.exports = Thinky(rethinkdb)
