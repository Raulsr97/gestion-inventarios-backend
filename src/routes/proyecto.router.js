const express = require('express');
const ProyectoService = require('../services/proyecto.service');
const { crearProyectoSchema } = require('../schemas/proyecto.schema');
const validatorHandler = require('../../middlewares/validator.handler');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const proyectos = await ProyectoService.obtenerProyectos();
        res.json(proyectos);
    } catch (error) {
        next(error);
    }
});

router.post('/', validatorHandler(crearProyectoSchema, 'body'), async (req, res, next) => {
    try {
        const nuevoProyecto = await ProyectoService.crearProyecto(req.body);
        res.status(201).json(nuevoProyecto);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
