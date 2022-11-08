const router = require('express').Router()
const controller = require('./usuarios.controller')

router.get('/', controller.obtener_usuarios)
router.post('/', controller.agregar_usuario)
router.put('/:id', controller.editar_usuario)
router.get('/:termino', controller.buscar_Usuarios)

router.put('/situacion/:id', controller.cambiar_situacion_usuario)

module.exports = router