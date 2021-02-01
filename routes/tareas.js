// rutas para crear tareas
const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// crear un tarea
// api/tareas
router.post('/',
    [
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ],
    auth,
    tareaController.crearTarea
);

// obtener tareas por proyecto
router.get('/',
    auth,
    tareaController.obtenerTareas
);

// actualizar una tarea via ID
router.put('/:id',
    [
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ],
    auth,
    tareaController.actualizarTarea
);

// eliminar una tarea via ID
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
);

module.exports = router;