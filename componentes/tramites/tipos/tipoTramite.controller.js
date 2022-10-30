const { request, response } = require("express");
const TipoTramite = require("./tipoTramite.model");
const Requerimiento = require("./requerimientos/requerimiento.model")
const agregar_TipoTramite = async (req = request, res = response) => {
  try {
    console.log(req.body);
    const value = new TipoTramite(req.body);

    const tipoTramite = await value.save();
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
    const tiposTramites = await TipoTramite.find({ activo: true })
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


const editar_requerimientos = async (req = request, res = response) => {
  // recibe id del tipo de tramite y id de requisito
  const { tipo, requisito } = req.params
  let cambiosRequerimiento = {}
  // crear campos a actualizar en array requerimientos
  for (const [key, value] of Object.entries(req.body)) {
    cambiosRequerimiento[`requerimientos.$.${key}`] = value
  }
  try {
    const result = await TipoTramite.updateOne({ "_id": tipo, "requerimientos._id": requisito }, {
      $set: cambiosRequerimiento
    })
    if (result.modifiedCount === 0) {
      return res.status(400).json({
        ok: false,
        message: "No se encontro el requisito para actualizar",
      });
    }
    res.json({
      ok: true,
      message: 'Requerimiento actualizado'
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: "Error al actualizar requerimiento",
    });
  }
}


module.exports = {
  agregar_TipoTramite,
  editar_TipoTramite,
  obtener_TiposTramites,

  editar_requerimientos
};
