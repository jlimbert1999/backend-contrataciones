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

router.get("/dependencias", controller.obtener_dependencias)

module.exports = router;
