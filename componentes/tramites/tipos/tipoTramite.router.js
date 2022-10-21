const router = require("express").Router();
const controller = require("./tipoTramite.controller");

router.post("/", controller.agregar_TipoTramite)

router.get("/", controller.obtener_TiposTramites)


module.exports = router;
