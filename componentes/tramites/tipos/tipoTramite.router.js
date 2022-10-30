const router = require("express").Router();
const controller = require("./tipoTramite.controller");

router.post("/", controller.agregar_TipoTramite)

router.get("/", controller.obtener_TiposTramites)


//requerimientos
router.put("/requerimientos/:tipo/:requisito", controller.editar_requerimientos)
module.exports = router;
