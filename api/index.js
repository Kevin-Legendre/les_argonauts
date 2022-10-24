const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const port = 3000

app.use(bodyParser.json())
app.use(cors())

app.use('/v1', require('./routes/argonaut'))

app.listen(port, () => {
  console.log('express listening on port ' + port)
})
