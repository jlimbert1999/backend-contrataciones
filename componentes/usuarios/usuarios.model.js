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
    },
    activo: {
        type: Boolean,
        default:true
    },
    cuenta:{
        type: Boolean,
        default:false
    }
})
UserScheme.method('toJSON', function () {
    //convertir el documento mongoose a object
    const { __v, _id,...object } = this.toObject()
    object.id_funcionario=_id
    return object
})

module.exports = model('funcionarios', UserScheme)