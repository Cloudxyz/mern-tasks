// rutas para crear proyectos
const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// crear un proyecto
// api/proyectos
router.post('/',
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    auth,
    proyectoController.crearProyecto
);

// obtener proyectos
router.get('/',
    auth,
    proyectoController.obtenerProyectos
);

// actualizar un proyecto via ID
router.put('/:id',
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    auth,
    proyectoController.actualizarProyecto
);

// eliminar un proyecto via ID
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);


module.exports = router;