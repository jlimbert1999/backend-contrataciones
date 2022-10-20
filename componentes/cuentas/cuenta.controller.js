const { request, response } = require('express')
const Cuenta = require('./cuenta.model')
const Usuario=require('../usuarios/usuarios.model')
const Dependencia=require('../dependencias/dependencias.model')
const bcrypt = require('bcrypt');

const agregar_cuenta= async (req = request, res = response) => {
    const {cuenta, funcionario}=req.body
    const { login } = cuenta
    const {dni}=funcionario
    
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
        funcionario.cuenta=true
        const newUser=new Usuario(funcionario)
        const userdb= await newUser.save()
       
        cuenta.funcionario=userdb._id
        const salt = bcrypt.genSaltSync();
        
        cuenta.password = bcrypt.hashSync(cuenta.password.toString(), salt)

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

  
  const editar_cuenta= async (req = request, res = response) => {
    let { login, password } = req.body
    const id_cuenta=req.params.id
    try {
        const cuentaDB = await Cuenta.findById(id_cuenta)
        if (!cuentaDB) {
            return res.status(400).json({
                ok: false,
                message: 'la cuenta no existe'
            })
        }
        if (cuentaDB.login !== login) {
            const existeLogin= await Cuenta.findOne({ login })
            if (existeLogin) {
                return res.status(400).json({
                    ok: false,
                    message: 'login introducido ya existe'
                })
            }
        }
        const salt = bcrypt.genSaltSync();
        password=password.toString()
        req.body.password  = bcrypt.hashSync(password, salt)

        const cuenta=await Cuenta.findByIdAndUpdate(id_cuenta, req.body, {new:true})
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
const asignar_cuenta= async (req = request, res = response) => {
    const id_cuenta=req.params.id
    const {id_funcionarioActual, id_funcionarioNuevo}=req.body
    try {
        // marcar al funcionario actual como sin cuenta
        await Usuario.findByIdAndUpdate(id_funcionarioActual, {cuenta:false})

        // marcar al nuevo funcionario como con cuenta
        await Usuario.findByIdAndUpdate(id_funcionarioNuevo, {cuenta:true})

        // asignar la cuenta al nuevo funcionario
        const cuenta=await Cuenta.findByIdAndUpdate(id_cuenta,{funcionario:id_funcionarioNuevo} , {new:true})
        console.log(cuenta);
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

const obtener_dependencias=async(req = request, res = response)=>{
    try {
        const dependencias=await Dependencia.find({activo: true}, 'nombre')
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
const obtener_funcionarios_asignacion= async(req = request, res = response)=>{
    try {
        const funcionarios=await Usuario.find({ cuenta:false, activo:true} , 'nombre cargo dni')
        
        res.send({
            ok:true,
            funcionarios
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            message:'error al obtener funcionarios para asignar cuentas'
        })
    }
}
module.exports={
    agregar_cuenta,
    obtener_cuentas,
    editar_cuenta,

    asignar_cuenta,
    obtener_dependencias,
    obtener_funcionarios_asignacion
}