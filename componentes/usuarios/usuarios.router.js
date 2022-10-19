const router = require('express').Router()
const controller = require('./usuarios.controller')

router.get('/', controller.obtener_usuarios)
router.post('/', controller.agregar_usuario)
router.put('/:id', controller.editar_usuario)

module.exports = router