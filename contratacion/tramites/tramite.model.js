const { Schema, model } = require('mongoose')

const TramiteScheme = Schema({
    ubicacion: {
        type: String
    },
    tipoTramite: {
        type: String,
        required: true
    },
    cuenta: {
        type: Schema.Types.ObjectId,
        ref: 'cuentas'
    },
    alterno: {
        type: String,
        required: true
    },
    codigo_proyecto: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    fecha_creacion: {
        type: Date,
        required: true
    },
    objeto: {
        type: String,
        required: true
    },
    apertura: {
        type: String,
        required: true
    },
    origen: {
        type: String,
        required: true
    },
    precio: {
        type: String,
        required: true
    },
    plazo_ejecucion: {
        type: String,
        required: true
    },
    modalidad: {
        type: String,
    },
    cuce: {
        type: String,
    },
    precio_adjudicado: {
        type: String,
    },
    tipo_contratacion: {
        type: String,
    },
    fecha_apertura_sobre: {
        type: String,
    },
    tipo_resolucion: {
        type: String,
    },
    empresa_adjudicada: {
        type: String,
    },
    representante_legal: {
        type: String,
    },
    observaciones: {
        type: String,
    }
})
TramiteScheme.method('toJSON', function () {
    //convertir el documento mongoose a object
    const { __v, _id, ...object } = this.toObject()
    object.id_tramite = _id
    return object
})

module.exports = model('tramites', TramiteScheme)