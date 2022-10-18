const { request, response } = require('express')
const Dependendencia = require('./dependencias.model')
const agregar_dependencias = async (req = request, res = response) => {
    try {
        const newDependencia = new Dependendencia(req.body)
        const dependenciasDB = newDependencia.save()
        res.json({
            ok: true,
            dependencia: dependenciasDB
        })
    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            message:'Error al registrar al dependencia'
        })

    }
}
const editar_dependencia = (req = request, res = response) => {

}

const obtener_dependencias = (req = request, res = response) => {
    res.send('obteniendo usuarios')
}


module.exports = {
    agregar_dependencias,
    editar_dependencia,
    obtener_dependencias
}