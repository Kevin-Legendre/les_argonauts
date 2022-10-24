const thinky = require('../lib/thinky')
const type = thinky.type

const Argonaut = thinky.createModel('Argonaut', {
  name: type.string()
})

module.exports = Argonaut
