const Tramite = require('./tramite.model')
const TiposTramites = require('../../componentes/tramites/tipos/tipoTramite.model')
const BandejaSalida = require('../../contratacion/bandejas/bandeja-salida.model')
const { request, response } = require('express')
const agregar_tramite = async (req = request, res = response) => {
    let data = req.body
    const id_cuenta = req.id_cuenta
    try {
        //Generar alterno
        const regex = new RegExp(data.alterno, 'i')
        let correlativo = await Tramite.find({ alterno: regex }).count()
        correlativo = correlativo + 1
        data.alterno = `${data.alterno}-${addLeadingZeros(correlativo, 5)}/${new Date().getFullYear()}`

        data.cuenta = id_cuenta
        data.estado = 'INSCRITO'
        data.fecha_creacion = new Date()
        const newTramite = new Tramite(data)
        const tramite = newTramite.save()
        res.json({
            ok: true,
            tramite
        })
    } catch (error) {
        console.log('[SERVER]: error (registrar tramite)', error);
        res.status(500).json({
            ok: true,
            message: 'error al registrar tramite'
        })

    }
}
const obtener_mis_tramites = async (req = request, res = response) => {
    const id_cuenta = req.id_cuenta
    try {
        const tramites = await Tramite.find({ cuenta: id_cuenta })
        res.json({
            ok: true,
            tramites
        })
    } catch (error) {
        console.log('[SERVER]: error (obtener tramites)', error);
        res.status(500).json({
            ok: true,
            message: 'Error al obtener mis tramites'
        })

    }
}
const editar_tramite = async (req = request, res = response) => {
    const id_tramite = req.params.id
    const data = req.body

    try {
        const tramite = await Tramite.findByIdAndUpdate(id_tramite, data, { new: true })
        res.json({
            ok: true,
            tramite
        })
    } catch (error) {
        console.log('[SERVER]: error (actualizar tramites)', error);
        res.status(500).json({
            ok: true,
            message: 'Error en el servidor'
        })

    }
}

const obtener_all_tramites = async (req = request, res = response) => {
    try {
        const tramites = await Tramite.find({}).populate('cuenta')
        res.json({
            ok: true,
            tramites
        })
    } catch (error) {
        console.log('[SERVER]: error (obtener todos los tramites)', error);
        res.status(500).json({
            ok: true,
            message: 'Error al obtener los tramites'
        })
    }
}

const obtener_info_tramite = async (req = request, res = response) => {
    const id_tramite = req.params.id
    try {
        const tramite = await Tramite.findById(id_tramite).populate({
            path: 'cuenta',
            select: '_id',
            populate: {
                path: 'funcionario dependencia',
                select: 'nombre cargo'
            }
        })
        const workflow = await BandejaSalida.find({ tramite: tramite }).select('fecha_envio fecha_recibido aceptado rechazado reenviado')
            .populate({
                path: 'cuenta_emisor',
                select: '_id',
                populate: {
                    path: 'funcionario dependencia',
                    select: 'nombre cargo'
                }
            })
            .populate({
                path: 'cuenta_receptor',
                select: '_id',
                populate: {
                    path: 'funcionario dependencia',
                    select: 'nombre cargo'
                }
            })
        res.json({
            ok: true,
            data: { tramite, workflow }
        })
    } catch (error) {
        console.log('[SERVER]: error (obtener todos los tramites)', error);
        res.status(500).json({
            ok: true,
            message: 'Error al obtener los tramites'
        })
    }
}

const filtrar_tramites = async (req = request, res = response) => {
    let termino = req.params.termino
    const tipo_filtro = req.query.tipo
    try {
        let tramites
        const regex = new RegExp(termino, 'i')
        if (tipo_filtro == 'Ubicacion') {
            tramites = await Tramite.find({ ubicacion: regex }).populate('cuenta')
        }
        else if (tipo_filtro == 'Modalidad') {
            tramites = await Tramite.find({ modalidad: regex }).populate('cuenta')
        }
        else if (tipo_filtro == 'Origen') {
            tramites = await Tramite.find({ origen: regex }).populate('cuenta')
        }
        res.json({
            ok: true,
            tramites
        })
    } catch (error) {
        console.log('[SERVER]: error (obtener todos los tramites)', error);
        res.status(500).json({
            ok: true,
            message: 'Error al obtener los tramites'
        })
    }
}






const obtener_tipos_tramites = async (req = request, res = response) => {
    try {
        const tiposTramites = await TiposTramites.find({ activo: true })
        res.json({
            ok: true,
            tiposTramites
        })
    } catch (error) {
        console.log('[SERVER]: error (obtener tipostramites)', error);
        res.status(500).json({
            ok: true,
            message: 'Error en el servidor'
        })

    }
}

const addLeadingZeros = (num, totalLength) => {
    return String(num).padStart(totalLength, '0');
}


module.exports = {
    agregar_tramite,
    obtener_mis_tramites,
    editar_tramite,

    obtener_info_tramite,
    filtrar_tramites,
    obtener_all_tramites,

    obtener_tipos_tramites
}