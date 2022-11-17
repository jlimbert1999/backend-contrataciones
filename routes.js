const router = require('express').Router()
const { verificarToken, verificarAdminRol } = require('./middlewares/jwt')
const usuariosRouter = require('./componentes/usuarios/usuarios.router')
const institucionRouter = require('./componentes/instituciones/instituciones.router')
const dependenciasRouter = require('./componentes/dependencias/dependencias.router')
const cuentasRouter = require('./componentes/cuentas/cuenta.router')
const routerAuth = require('./componentes/auth/auth.router')

const tiposTramitesRouter = require('./componentes/tramites/tipos/tipoTramite.router')
const RequerimientosRouter = require('./componentes/tramites/tipos/requerimientos/requerimiento.router')

const TramitesRouter = require('./contratacion/tramites/tramite.router')
const BandejaRouter = require('./contratacion/bandejas/bandeja.router')


router.use('/login', routerAuth)
// ADMINISTRADOR
router.use('/usuarios', [verificarToken, verificarAdminRol], usuariosRouter)
router.use('/cuentas', [verificarToken, verificarAdminRol], cuentasRouter)
router.use('/instituciones', [verificarToken, verificarAdminRol], institucionRouter)
router.use('/dependencias', [verificarToken, verificarAdminRol], dependenciasRouter)
router.use('/tipos-tramites', tiposTramitesRouter)
router.use('/requerimientos', RequerimientosRouter)


// FUNCIONARIOS
router.use('/tramites', [verificarToken], TramitesRouter)
router.use('/bandejas', [verificarToken], BandejaRouter)

module.exports = router