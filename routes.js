const router = require('express').Router()
const usuariosRouter = require('./componentes/usuarios/usuarios.router')
const institucionRouter = require('./componentes/instituciones/instituciones.router')
const dependenciasRouter=require('./componentes/dependencias/dependencias.router')
const cuentasRouter=require('./componentes/cuentas/cuenta.router')
const routerAuth=require('./componentes/auth/auth.router')
router.use('/usuarios', usuariosRouter)

router.use('/cuentas', cuentasRouter)

router.use('/instituciones', institucionRouter)

router.use('/dependencias', dependenciasRouter)

router.use('/login', routerAuth)

module.exports = router