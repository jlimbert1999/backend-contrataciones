const { request, response } = require('express')
const Cuenta = require('./cuenta.model')
const Usuario = require('../usuarios/usuarios.model')
const Dependencia = require('../dependencias/dependencias.model')
const Institucion = require('../instituciones/instituciones.model')
const bcrypt = require('bcrypt');

const agregar_cuenta = async (req = request, res = response) => {
    const { cuenta, funcionario } = req.body
    const { login } = cuenta
    const { dni } = funcionario
    try {
        const existeLogin = await Cuenta.findOne({ login })
        if (existeLogin) {
            return res.status(400).json({
                ok: false,
                message: 'login introducido ya existe'
            })
        }
        const existeDni = await Usuario.findOne({ dni })
        if (existeDni) {
            return res.status(400).json({
                ok: false,
                message: 'El dni introducido ya existe'
            })
        }
        const salt = bcrypt.genSaltSync();
        cuenta.password = bcrypt.hashSync(cuenta.password.toString(), salt)
        const newCuenta = new Cuenta(cuenta)
        let cuentaDB = await newCuenta.save()

        funcionario.cuenta = cuentaDB._id
        const newUser = new Usuario(funcionario)
        let userdb = await newUser.save()
        userdb = await userdb.populate(
            {
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
            }
        )
        res.json({
            ok: true,
            cuenta: userdb
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al registrar cuenta'
        })

    }
}
const obtener_cuentas = async (req = request, res = response) => {
    let { page, rows } = req.query;
    page = parseInt(page) || 0;
    rows = parseInt(rows) || 10;
    page = page * rows
    try {
        const [cuentas, total] = await Promise.all(
            [
                Usuario.find({}).sort({ _id: -1 }).skip(page).limit(rows)
                    .populate({
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
                    }),
                Usuario.count()
            ]
        )
        res.json({
            ok: true,
            cuentas,
            total
        });
    } catch (error) {
        console.log(
            "[SERVER]: error (obtener obtener cuentas)",
            error
        );
        res.json({
            ok: false,
            message: "Error al obtener cuentas",
        });
    }
};
const editar_cuenta = async (req = request, res = response) => {
    let { login, password } = req.body
    const id_cuenta = req.params.id
    try {
        const cuentaDB = await Cuenta.findById(id_cuenta)
        if (!cuentaDB) {
            return res.status(400).json({
                ok: false,
                message: 'la cuenta no existe'
            })
        }
        if (cuentaDB.login !== login) {
            const existeLogin = await Cuenta.findOne({ login })
            if (existeLogin) {
                return res.status(400).json({
                    ok: false,
                    message: 'login introducido ya existe'
                })
            }
        }
        if (password) {
            const salt = bcrypt.genSaltSync();
            password = password.toString()
            req.body.password = bcrypt.hashSync(password, salt)
        }
        let cuenta = await Cuenta.findByIdAndUpdate(id_cuenta, req.body, { new: true })
        cuenta = cuenta.toObject()
        delete cuenta.password
        res.json({
            ok: true,
            cuenta
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al editar cuenta'
        })

    }
}
const buscar_cuenta = async (req = request, res = response) => {
    const termino = req.params.termino
    let { page, rows } = req.query;
    page = parseInt(page) || 0;
    rows = parseInt(rows) || 10;
    page = page * rows
    try {
        const regex = new RegExp(termino, 'i')
        const [cuentas, total] = await Promise.all(
            [
                Usuario.find(
                    {
                        $or: [{ nombre: regex }, { dni: regex }, { cargo: regex }]
                    }
                ).skip(page).limit(rows)
                    .populate({
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
                    }),
                Usuario.find(
                    {
                        $or: [{ nombre: regex }, { dni: regex }, { cargo: regex }]
                    }
                ).count()
            ]
        )
        res.json({
            ok: true,
            cuentas,
            total
        });
    } catch (error) {
        console.log(
            "[SERVER]: error (obtener obtener cuentas)",
            error
        );
        res.json({
            ok: false,
            message: "Error al obtener cuentas",
        });
    }
};

const asignar_cuenta = async (req = request, res = response) => {
    const id_cuenta = req.params.id
    const { id_funcionarioActual, id_funcionarioNuevo, newCuenta } = req.body
    let { password } = newCuenta
    try {
        // marcar al funcionario actual como sin cuenta
        await Usuario.findByIdAndUpdate(id_funcionarioActual, { cuenta: null })

        //actualizar login y password de la nueva cuenta
        const salt = bcrypt.genSaltSync();
        password = password.toString()
        newCuenta.password = bcrypt.hashSync(password, salt)
        await Cuenta.findByIdAndUpdate(id_cuenta, newCuenta)

        // asignar la cuenta al nuevo funcionario
        const cuenta = await Usuario.findByIdAndUpdate(id_funcionarioNuevo, { cuenta: id_cuenta }, { new: true })
            .populate({
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
            cuenta
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al asignar cuenta'
        })

    }
}
const obtener_instituciones = async (req = request, res = response) => {
    try {
        const instituciones = await Institucion.find({ activo: true }, 'nombre')
        res.send({
            ok: true,
            instituciones
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'error al obtener instituciones para cuentas'
        })
    }

}
const obtener_dependencias = async (req = request, res = response) => {
    const id = req.params.id_institucion
    try {
        const dependencias = await Dependencia.find({ activo: true, institucion: id }, 'nombre')
        res.send({
            ok: true,
            dependencias
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'error al obtener dependencias para cuentas'
        })
    }

}
const obtener_funcionarios_asignacion = async (req = request, res = response) => {
    try {
        const funcionarios = await Usuario.find({ cuenta: null, activo: true }, 'nombre cargo dni')
        res.send({
            ok: true,
            funcionarios
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'error al obtener funcionarios para asignar cuentas'
        })
    }
}

const filtrar_cuentas = async (req = request, res = response) => {
    const id_dependencia = req.params.id_dependencia
    try {
        const usuarios = await Usuario.find({ id_dependencia }, 'nombre cargo dni').populate({
            path: 'cuenta',
            select: '_id login rol',
            populate: {
                path: 'dependencia',
                match: {
                    nombre: regex
                },
                select: 'nombre -_id',
                populate: {
                    path: 'institucion',
                    select: 'sigla -_id'
                }
            }
        })
        res.send({
            ok: true,
            usuarios
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'error al obtener funcionarios para asignar cuentas'
        })
    }
}


module.exports = {
    agregar_cuenta,
    obtener_cuentas,
    editar_cuenta,
    buscar_cuenta,

    asignar_cuenta,
    obtener_instituciones,
    obtener_dependencias,
    obtener_funcionarios_asignacion
}