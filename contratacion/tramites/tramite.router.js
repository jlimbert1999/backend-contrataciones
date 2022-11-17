const router = require('express').Router()
const controller = require('./tramite.controller')

router.post('/', controller.agregar_tramite)

router.get('/', controller.obtener_mis_tramites)

router.put('/:id', controller.editar_tramite)

router.get('/:id', controller.obtener_info_tramite)

router.get('/filtrar/:termino', controller.filtrar_tramites)

router.get('/control/registrados', controller.obtener_all_tramites)

router.get('/tipos-tramites', controller.obtener_tipos_tramites)


module.exports = router