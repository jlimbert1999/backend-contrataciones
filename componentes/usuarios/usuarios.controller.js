const { request, response } = require('express')
const Usuario=require('./usuarios.model')
const agregar_usuario = async (req = request, res = response) => {
    const {dni}=req.body
    try {
        const existeDni = await Usuario.findOne({ dni })
        if (existeDni) {
            return res.status(400).json({
                ok: false,
                message: 'El dni introducido ya existe'
            })
        }
        const newUser=new Usuario(req.body)
        const userdb= await newUser.save()
        res.json({
            ok: true,
            funcionario: userdb
        })
        
    } catch (error) {
        console.log('[SERVER]: error (agregar funcionarios)', error);
        res.status(500).json({
            ok: true,
            message:'error al registrar funcionario'
        })
        
    }
   
}
const editar_usuario = async (req = request, res = response) => {
    const {dni}=req.body
    const id_funcionario=req.params.id
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
       
        const funcionario=await Usuario.findByIdAndUpdate(id_funcionario, req.body, {new:true})
        console.log(funcionario);
        res.json({
            ok: true,
            funcionario
        })
        
    } catch (error) {
        console.log('[SERVER]: error (editar funcionarios)', error);
        res.status(500).json({
            ok: true,
            message:'error al editar funcionario'
        })
        
    }
}

const actualizar_usuario = (req = request, res = response) => {

}

const obtener_usuarios =async (req = request, res = response) => {
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
            message:'error al obtene funcionario'
        })
        
    }
}  


module.exports = {
    agregar_usuario,
    editar_usuario,
    actualizar_usuario,
    obtener_usuarios
}