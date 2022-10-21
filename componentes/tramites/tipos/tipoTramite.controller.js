const { request, response } = require("express");
const TipoTramite = require("./tipoTramite.model");
const agregar_TipoTramite = async (req = request, res = response) => {
  try {
    const newtipoTramite = new TipoTramite(req.body);
    const tipoTramite = await newtipoTramite.save();
    res.json({
      ok: true,
      tipoTramite,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: "Error al registrar tipo tramite",
    });
  }
};
const editar_TipoTramite = async (req = request, res = response) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: "Error al registrar cuenta",
    });
  }
};
const obtener_TiposTramites = async (req = request, res = response) => {
  try {
    const tiposTramites = await TipoTramite.find({activ:true})
    res.json({
      ok: true,
      tiposTramites,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener tipos de tramite",
    });
  }
};

module.exports = {
  agregar_TipoTramite,
  editar_TipoTramite,
  obtener_TiposTramites,
};
