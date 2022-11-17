const BandejaEntrada = require('./bandeja-entrada.model')
const BandejaSalida = require('./bandeja-salida.model')
const Cuenta = require('../../componentes/cuentas/cuenta.model')
const Tramite = require('../../contratacion/tramites/tramite.model')

const { request, response } = require('express')

const agregar_mail = async (req = request, res = response) => {
    let { data, detalles_reenvio } = req.body
    const id_cuenta = req.id_cuenta
    data.cuenta_emisor = id_cuenta
    data.fecha_envio = new Date()
    data.recibido = false
    try {
        if (detalles_reenvio) {
            // si existe es reenvio
            await BandejaSalida.findOneAndUpdate({ tramite: data.tramite, cuenta_emisor: id_cuenta, cuenta_receptor: detalles_reenvio.cuenta_receptor, aceptado: false, rechazado: true, reenviado: false }, { reenviado: true })
        }
        const nuevoMailEntrada = await BandejaEntrada.findOneAndUpdate({ tramite: data.tramite }, data, { upsert: true, new: true })
        const newMailOut = new BandejaSalida(data)
        await newMailOut.save()
        res.json({
            ok: true,
            tramite: nuevoMailEntrada
        })
    } catch (error) {
        console.log('[SERVER]: error (enviar tramite)', error);
        res.status(500).json({
            ok: true,
            message: 'error al enviar tramite'
        })
    }
}

const obtener_bandeja_entrada = async (req = request, res = response) => {
    const id_cuenta = req.id_cuenta
    try {
        const tramites = await BandejaEntrada.find({ cuenta_receptor: id_cuenta }).populate('tramite')
        res.json({
            ok: true,
            tramites
        })

    } catch (error) {
        console.log('[SERVER]: error (obtener bandeja entrada)', error);
        res.status(500).json({
            ok: true,
            message: 'error al obtener bandeja entrada'
        })
    }
}

const obtener_bandeja_salida = async (req = request, res = response) => {
    const id_cuenta = req.id_cuenta
    try {
        const tramites = await BandejaSalida.find({ cuenta_emisor: id_cuenta }).populate('tramite')
        res.json({
            ok: true,
            tramites
        })

    } catch (error) {
        console.log('[SERVER]: error (obtener bandeja salida)', error);
        res.status(500).json({
            ok: true,
            message: 'error al obtener bandeja salida'
        })
    }
}




const obtener_usuarios_envio = async (req = request, res = response) => {
    const id_dependencia = req.params.id_dependencia
    try {
        const funcionarios = await Cuenta.find({ dependencia: id_dependencia })
            .select('_id')
            .populate('funcionario', 'nombre cargo')
            .populate({
                path: 'dependencia',
                select: 'nombre -_id',
                populate: {
                    path: 'institucion',
                    select: 'sigla -_id'
                }
            })
        res.json({
            ok: true,
            funcionarios
        })
    } catch (error) {
        console.log('[SERVER]: error (obtener funcionarios para envio)', error);
        res.status(500).json({
            ok: true,
            message: 'error obtener funcionarios para envio'
        })
    }
}


const aceptar_tramite = async (req = request, res = response) => {
    const id_tramite = req.params.id_tramite
    const cuenta_receptor = req.id_cuenta
    const { cuenta_emisor, ubicacion } = req.body
    try {
        await Tramite.findByIdAndUpdate(id_tramite, { ubicacion })
        await BandejaEntrada.findOneAndUpdate({ tramite: id_tramite }, { recibido: true })
        await BandejaSalida.findOneAndUpdate({ tramite: id_tramite, cuenta_emisor, cuenta_receptor, aceptado: false, rechazado: false, reenviado: false }, { aceptado: true, fecha_recibido: new Date() })
        res.json({
            ok: true,
            message: 'Tramite aceptado'
        })
    } catch (error) {
        console.log('[SERVER]: error (aceptar tramite)', error);
        res.status(500).json({
            ok: true,
            message: 'No se ha podido aceptar el tramite'
        })
    }
}

const rechazar_tramite = async (req = request, res = response) => {
    const id_tramite = req.params.id_tramite
    const cuenta_receptor = req.id_cuenta
    const { cuenta_emisor } = req.body
    try {
        await BandejaEntrada.findOneAndDelete({ tramite: id_tramite })
        await BandejaSalida.findOneAndUpdate({ tramite: id_tramite, cuenta_emisor, cuenta_receptor, aceptado: false, rechazado: false, reenviado: false }, { rechazado: true, fecha_recibido: new Date() })
        res.json({
            ok: true,
            message: 'Se rechazo el tramite'
        })
    } catch (error) {
        console.log('[SERVER]: error (rechazar tramite)', error);
        res.status(500).json({
            ok: true,
            message: 'No se ha podido rechazar el tramite'
        })
    }
}





module.exports = {
    agregar_mail,
    obtener_bandeja_entrada,
    obtener_bandeja_salida,
    aceptar_tramite,
    rechazar_tramite,

    obtener_usuarios_envio
}