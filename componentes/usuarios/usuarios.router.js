const router = require('express').Router()
const controller = require('./usuarios.controller')

router.get('/', controller.obtener_usuarios)

module.exports = router