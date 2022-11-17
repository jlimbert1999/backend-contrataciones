const { Schema, model } = require('mongoose')

const BandejaSalidaScheme = Schema({
    cuenta_emisor: {
        type: Schema.Types.ObjectId,
        ref: 'cuentas'
    },
    cuenta_receptor: {
        type: Schema.Types.ObjectId,
        ref: 'cuentas'
    },
    tramite: {
        type: Schema.Types.ObjectId,
        ref: 'tramites'
    },
    motivo: {
        type: String,
        required: true
    },
    fecha_envio: {
        type: Date,
        required: true
    },
    fecha_recibido: {
        type: Date,
    },
    aceptado: {
        type: Boolean,
        default: false
    },
    rechazado: {
        type: Boolean,
        default: false
    },
    reenviado: {
        type: Boolean,
        default: false
    }


})
BandejaSalidaScheme.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    return object
})
module.exports = model('bandeja_salida', BandejaSalidaScheme)