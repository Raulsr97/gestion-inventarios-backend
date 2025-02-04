const express = require('express');
const RefaccionService = require('../services/refaccion.service');
const { crearRefaccionSchema } = require('../schemas/refaccion.schema');
const validatorHandler = require('../../middlewares/validator.handler');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const refacciones = await RefaccionService.obtenerRefacciones();
        res.json(refacciones);
    } catch (error) {
        next(error);
    }
});

router.post('/', validatorHandler(crearRefaccionSchema, 'body'), async (req, res, next) => {
    try {
        const nuevaRefaccion = await RefaccionService.crearRefaccion(req.body);
        res.status(201).json(nuevaRefaccion);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
