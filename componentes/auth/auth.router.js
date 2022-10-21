const router = require("express").Router();
const controller = require("./auth.controller");
const { verificarToken } = require("../../middlewares/jwt");
const {getMenuFrontend}= require('../../helpers/menu-frontend')

router.post("/", controller.login);

router.get("/verify", verificarToken, (req, res) => {
  res.send({
    ok: true,
    Menu:getMenuFrontend(req.rol),
    message: "sesion validada"
  });
});

module.exports = router;
