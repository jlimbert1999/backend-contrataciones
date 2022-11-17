const { request, response } = require('express')
const Cuenta = require('../cuentas/cuenta.model')
const Usuario = require('../usuarios/usuarios.model')
const bcrypt = require('bcrypt');
const jwt = require('../../helpers/generate_token')

const login = async (req = request, res = response) => {
    try {
        const { login, password } = req.body
        const cuentaDB = await Cuenta.findOne({ login }).populate({
            path: 'dependencia',
            select: 'nombre -_id',
            populate: {
                path: 'institucion',
                select: 'sigla -_id'
            }
        }).populate('funcionario', 'nombre cargo rol')
        if (!cuentaDB) {
            return res.status(400).send({
                ok: false,
                message: "El Login o Contraseña no son correctos"
            })
        }
        const validPassword = bcrypt.compareSync(password, cuentaDB.password)
        if (!validPassword) {
            return res.status(400).send({
                ok: false,
                message: "El Login o Contraseña no son correctos"
            })
        }
        let token
        if (!cuentaDB.funcionario && !cuentaDB.dependencia && cuentaDB.rol === "admin") {
            token = await jwt.generarToken(cuentaDB._id, "Administrador", 'Configuraciones', cuentaDB.rol, '', '')
        }
        else {
            token = await jwt.generarToken(cuentaDB._id, cuentaDB.funcionario.nombre, cuentaDB.funcionario.cargo, cuentaDB.rol, cuentaDB.dependencia.nombre, cuentaDB.dependencia.institucion.sigla)
        }
        res.send({
            ok: true,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "error en login"
        })
    }
};


const renovar_token = async (req = request, res = response) => {
    try {
        const usuarioDb = await Cuenta.findById(req.id_cuenta)
        res.send({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "error en login"
        })
    }
}


module.exports = {
    login
}
