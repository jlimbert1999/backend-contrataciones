const router = require('express').Router()
const usuariosRouter = require('./componentes/usuarios/usuarios.router')
const institucionRouter = require('./componentes/instituciones/instituciones.router')

router.use('/usuarios', usuariosRouter)

router.use('/instituciones', institucionRouter)

module.exports = router