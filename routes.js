const router = require('express').Router()
const usuariosRouter = require('./componentes/usuarios/usuarios.router')
const institucionRouter = require('./componentes/instituciones/instituciones.router')
const dependenciasRouter=require('./componentes/dependencias/dependencias.router')

router.use('/usuarios', usuariosRouter)

router.use('/instituciones', institucionRouter)

router.use('/dependencias', dependenciasRouter)

module.exports = router