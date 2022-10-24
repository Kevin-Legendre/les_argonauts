const express = require('express')
const Argonaut = require('../models/argonaut')
const router = express.Router()
const async = require('async')

router.get('/argonauts', (req, res, next) => {
  Argonaut.then((args) => {
    res.json(args)
  })
    .error(next)
})

router.post('/argonaut', (req, res, next) => {
  if (!req.body.name) {
    return next('Bad request')
  }

  Argonaut.filter({ name: req.body.name })
    .orderBy('name')
    .then((argonauts) => {
      if (argonauts.length > 0) {
        return res.status(409).send('Already exist')
      }
      const argonaut = new Argonaut({
        name: req.body.name
      })
      return argonaut.save().then((arg) => {
        res.json(arg)
      })
    })
    .error(next)
})

router.put('/argonaut/:id', (req, res, next) => {
  if (!req.params.id || !req.body.name) {
    return next('Bad Request')
  }

  Argonaut.filter({ name: req.body.name }).then((args) => {
    if (args.length > 1 && args[0].id !== req.body.id) {
      return res.status(409).send('Already exist')
    } else {
      return next()
    }
  })
    .error(next)
})

router.put('/argonaut/:id', (req, res, next) => {
  Argonaut.get(req.params.id).then((arg) => {
    arg.name = req.body.name
    arg.save().then((a) => {
      res.json(a)
    })
  })
    .error(next)
})

router.delete('/argonauts', (req, res, next) => {
  Argonaut.then((argonauts) => {
    async.eachLimit(argonauts, 4, (arg, cb) => {
      return arg.delete().then(() => cb())
    }, function (err) {
      if (err) {
        throw err
      }
      res.sendStatus(204)
    })
  })
    .error(next)
})

module.exports = router
