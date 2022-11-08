const { request, response } = require('express')
const Usuario = require('./usuarios.model')
const agregar_usuario = async (req = request, res = response) => {
    const { dni } = req.body
    try {
        const existeDni = await Usuario.findOne({ dni })
        if (existeDni) {
            return res.status(400).json({
                ok: false,
                message: 'El dni introducido ya existe'
            })
        }
        const newUser = new Usuario(req.body)
        const userdb = await newUser.save()
        res.json({
            ok: true,
            funcionario: userdb
        })

    } catch (error) {
        console.log('[SERVER]: error (agregar funcionarios)', error);
        res.status(500).json({
            ok: true,
            message: 'error al registrar funcionario'
        })

    }

}
const editar_usuario = async (req = request, res = response) => {
    const { dni } = req.body
    const id_funcionario = req.params.id
    try {
        const usuariodb = await Usuario.findById(id_funcionario)
        if (!usuariodb) {
            return res.status(400).json({
                ok: false,
                message: 'El id del funcionario no existe'
            })

        }
        if (usuariodb.dni !== dni) {
            const existeDni = await Usuario.findOne({ dni })
            if (existeDni) {
                return res.status(400).json({
                    ok: false,
                    message: 'El dni introducido ya existe'
                })
            }
        }

        const funcionario = await Usuario.findByIdAndUpdate(id_funcionario, req.body, { new: true }).populate({
            path: 'cuenta',
            select: '_id login rol',
            populate: {
                path: 'dependencia',
                select: 'nombre -_id',
                populate: {
                    path: 'institucion',
                    select: 'sigla -_id'
                }
            }
        })
        res.json({
            ok: true,
            funcionario
        })

    } catch (error) {
        console.log('[SERVER]: error (editar funcionarios)', error);
        res.status(500).json({
            ok: true,
            message: 'error al editar funcionario'
        })

    }
}



const obtener_usuarios = async (req = request, res = response) => {
    try {
        const [funcionarios, total] = await Promise.all(
            [
                Usuario.find({}),
                Usuario.count()
            ]
        )

        res.json({
            ok: true,
            funcionarios,
            total
        })

    } catch (error) {
        console.log('[SERVER]: error (obtener funcionarios)', error);
        res.status(500).json({
            ok: true,
            message: 'error al obtene funcionario'
        })

    }
}

const buscar_Usuarios = async (req = request, res = response) => {
    let { pageIndex, rows } = req.query
    pageIndex = parseInt(pageIndex) || 0
    rows = parseInt(rows) || 10
    pageIndex = rows * pageIndex
    const termino = req.params.termino
    try {
        const regex = new RegExp(termino, 'i')
        const [funcionarios, total] = await Promise.all(
            [
                Usuario.find({ $or: [{ nombre: regex }, { dni: regex }, { cargo: regex }] }).skip(pageIndex).limit(rows),
                Usuario.find({ $or: [{ nombre: regex }, { dni: regex }, { cargo: regex }] }).count()
            ]
        )
        res.json({
            ok: true,
            funcionarios,
            total
        })
    } catch (error) {
        console.log('[Server]: Error (buscar funcionario) =>', error);
        res.status(400).send({
            ok: false,
            message: 'Error al buscar funcionario'
        })
    }
};
const cambiar_situacion_usuario = async (req = request, res = response) => {
    const { activo } = req.body
    const id_funcionario = req.params.id
    try {
        const UsuariosDB = await Usuario.findOne({ _id: id_funcionario })
        if (UsuariosDB.cuenta) {
            return res.status(400).json({
                ok: false,
                message: 'El funcionario esta asignado a una cuenta'
            })
        }
        const funcionario = await Usuario.findByIdAndUpdate(id_funcionario, { activo }, { new: true })
        res.json({
            ok: true,
            funcionario
        })

    } catch (error) {
        console.log('[SERVER]: error (cambiar situacion funcionario)', error);
        res.status(500).json({
            ok: true,
            message: 'cambiar situacion funcionario'
        })

    }
}


module.exports = {
    agregar_usuario,
    editar_usuario,
    obtener_usuarios,
    buscar_Usuarios,
    cambiar_situacion_usuario,
}