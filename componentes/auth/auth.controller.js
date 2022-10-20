const { request, response } = require('express')
const Cuenta = require('../cuentas/cuenta.model')
const bcrypt = require('bcrypt');

const login = async (req = request, res = response) => {
    try {
        console.log(req.body);
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message: "error en login"
        })
    }
  };

  module.exports={
    login
  }
