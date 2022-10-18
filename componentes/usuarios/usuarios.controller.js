const { request, response } = require('express')
const agregar_usuario = (req = request, res = response) => {

}
const editar_usuario = (req = request, res = response) => {

}

const actualizar_usuario = (req = request, res = response) => {

}

const obtener_usuarios = (req = request, res = response) => {
    res.send('obteniendo usuarios')
}  


module.exports = {
    agregar_usuario,
    editar_usuario,
    actualizar_usuario,
    obtener_usuarios
}