const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearTarea = async (req, res) => {

    // revisar si hay errores 
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    try {
        // extramos el proyecto y comprobamos si existe
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);

        if(!existeProyecto){
            return res.status(400).json({msg: 'Proyecto no encontrado'})
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: "No autorizado"})
        }

        // crear nueva tarea
        const tarea = new Tarea(req.body); 

        // guardar proyecto en el tarea
        tarea.proyecto = existeProyecto._id;

        // guardar tarea
        await tarea.save();
        res.json(tarea);
        
        // mensaje de confirmación
        res.json({ msg: 'Tarea creada correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

// obtiene todos los tareas del proyecto actual
exports.obtenerTareas = async (req, res) => {

    try {
        // extramos el proyecto y comprobamos si existe
        const { proyecto } = req.query;

        const existeProyecto = await Proyecto.findById(proyecto);

        if(!existeProyecto){
            return res.status(400).json({msg: 'Proyecto no encontrado'})
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: "No autorizado"})
        }

        // obtener tareas
        const tareas = await Tarea.find({ proyecto }).sort({creado: -1});
        res.json(tareas);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

// actualizar un tarea
exports.actualizarTarea = async (req, res) => {
    // revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    try {
        // extramos el proyecto y comprobamos si existe
        const { proyecto, nombre, estado } = req.body;

        // revisar
        let tarea = await Tarea.findById(req.params.id);

        // si el tarea existe o no
        if(!tarea){
            return res.status(404).json({msg: "Tarea no encontrada"})
        }

        const existeProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: "No autorizado"})
        }

        // extraer la informacion del tarea
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        // actualizar
        tarea = await Tarea.findByIdAndUpdate({ _id: req.params.id }, { $set : nuevaTarea }, { new: true });
        res.json(tarea);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

// eliminar un tarea
exports.eliminarTarea = async (req, res) => {
    
    try {
        // extramos el proyecto y comprobamos si existe
        const { proyecto} = req.query;

        // revisar
        let tarea = await Tarea.findById(req.params.id);

        // si el tarea existe o no
        if(!tarea){
            return res.status(404).json({msg: "Tarea no encontrada"})
        }

        const existeProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: "No autorizado"})
        }

        // eliminar
        tarea = await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({msg: 'Tarea Eliminada'});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}