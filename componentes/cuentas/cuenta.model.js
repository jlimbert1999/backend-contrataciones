const { Schema, model } = require('mongoose')

const CuentasScheme = Schema({
    dependencia: {
        type: Schema.Types.ObjectId,
        ref: 'dependencias'
    },
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true
    },
    funcionario: {
        type: Schema.Types.ObjectId,
        ref: 'funcionarios'
    },

})
CuentasScheme.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    object.id_cuenta = _id
    return object
})
module.exports = model('cuentas', CuentasScheme)