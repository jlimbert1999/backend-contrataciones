const { Schema, model } = require('mongoose')

const BandejaEntradaScheme = Schema({
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
    recibido: {
        type: Boolean,
        default: false
    }
})
BandejaEntradaScheme.method('toJSON', function () {
    //convertir el documento mongoose a object
    const { __v, _id, ...object } = this.toObject()
    return object
})

module.exports = model('bandeja_entrada', BandejaEntradaScheme)