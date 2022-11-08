const router = require("express").Router();
const controller = require("./cuenta.controller");
const validarBody = require("../../middlewares/validar_body");
const { check } = require("express-validator");

router.post("/", [
    check('cuenta').isObject(),
    check('funcionario').isObject(),
    validarBody
], controller.agregar_cuenta);
router.get("/", controller.obtener_cuentas)
router.put("/:id", controller.editar_cuenta)
router.get("/busqueda/:termino", controller.buscar_cuenta)

router.put("/asignar/:id", controller.asignar_cuenta)

router.get("/instituciones", controller.obtener_instituciones)

router.get("/dependencias/:id_institucion", controller.obtener_dependencias)

router.get("/usuarios", controller.obtener_funcionarios_asignacion)



module.exports = router;
