const { request, response } = require('express')
const Cuenta = require('./cuenta.model')
const Usuario=require('../usuarios/usuarios.model')
const Dependencia=require('../dependencias/dependencias.model')

const agregar_cuenta= async (req = request, res = response) => {
    const {cuenta, funcionario}=req.body
    const { login } = cuenta
    const {dni}=funcionario
    console.log(req.body);
    try {
        const existeDni = await Usuario.findOne({ dni })
        if (existeDni) {
            return res.status(400).json({
                ok: false,
                message: 'El dni introducido ya existe'
            })
        }
        const existeLogin= await Cuenta.findOne({ login })
        if (existeLogin) {
            return res.status(400).json({
                ok: false,
                message: 'login introducido ya existe'
            })
        }
        const newUser=new Usuario(funcionario)
        const userdb= await newUser.save()
        console.log(userdb);
        cuenta.funcionario=userdb._id
        const newCuenta= new Cuenta(cuenta)
        const cuentaDB = await newCuenta.save()
        res.json({
            ok: true,
            cuenta: cuentaDB
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
    try {
      const cuentas = await Cuenta.find({funcionario:{$exists: true, $ne: null}}, "login rol").populate('funcionario', 'nombre cargo').populate('dependencia', 'nombre');
      res.json({
        ok: true,
        cuentas,
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
const obtener_dependencias=async(req = request, res = response)=>{
    try {
        const dependencias=await Dependencia.find({}, 'nombre')
        res.send({
            ok:true,
            dependencias
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            message:'error al obtener dependencias para cuentas'
        })
    }

}
module.exports={
    agregar_cuenta,
    obtener_cuentas,

    obtener_dependencias
}