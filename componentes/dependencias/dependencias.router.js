const router = require('express').Router()
const controller = require('./dependencias.controller')

router.post('/', controller.agregar_dependencias)

module.exports = router