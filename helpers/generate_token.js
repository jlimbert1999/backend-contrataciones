const jwt = require('jsonwebtoken')
const generarToken = (id_cuenta, funcionario, cargo, rol, dependencia, institucion) => {
    
    return new Promise((resolve, reject) => {
        const payload = {
            id_cuenta,
            funcionario,
            cargo,
            rol,
            dependencia,
            institucion
        }
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '8h'
        }, (err, token) => {
            if (err) {
                console.log('[SERVER]: error (generar token) => ', err);
                return reject({ code: 500, message: 'Error interno, intente de nuevo' })
            }
            else {
                resolve(token)
            }
        })
    })
}
module.exports = {
    generarToken
}