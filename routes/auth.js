// rutas para autentificación
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// iniciar sesion
// api/auth
router.post('/',
    authController.autenticarUsuario
);

// obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);

module.exports = router;