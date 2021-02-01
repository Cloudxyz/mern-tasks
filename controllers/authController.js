const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    // revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    // extraer el email y password
    const { email, password } = req.body;

    try {
        // revisar que exista usuario
        let usuario = await Usuario.findOne({ email });
        if(!usuario){
            return res.status(400).json({msg: 'El usuario no existe'});
        }

        // resivar password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto){
            return res.status(400).json({msg: 'El password es incorrecto'});
        }

        // si todo es correcto crear jwt
        // crear y firmar JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // firmar JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 7200 // 2 horas
        }, (error, token) => {
            if(error) throw error;

            res.json({ token });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// obtiene el usuario autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}