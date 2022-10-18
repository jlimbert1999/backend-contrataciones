const { Schema, model } = require('mongoose')

const UserScheme = Schema({
    nombre: {
        type: String,
        required: true
    },
    dni: {
        type: Number,
        required: true,
        unique: true
    },
    telefono: {
        type: Number,
        required: true
    },
    direccion: {
        type: String
    },
    cargo: {
        type: String,
        required: true
    }
})
UserScheme.method('toJSON', function () {
    //convertir el documento mongoose a object
    const { __v, password, ...object } = this.toObject()
    return object
})

module.exports = model('Funcionarios', UserScheme)