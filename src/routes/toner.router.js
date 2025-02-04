const express = require('express');
const TonerService = require('../services/toner.service');
const { crearTonerSchema } = require('../schemas/toner.schema');
const validatorHandler = require('../../middlewares/validator.handler');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const toners = await TonerService.obtenerToners();
        res.json(toners);
    } catch (error) {
        next(error);
    }
});

router.post('/', validatorHandler(crearTonerSchema, 'body'), async (req, res, next) => {
    try {
        const nuevoToner = await TonerService.crearToner(req.body);
        res.status(201).json(nuevoToner);
    } catch (error) {
        next(error);
    }
});

router.post('/registrar-lote', async (req, res, next) => {
    try {
        const { modelo, cliente_id, series } = req.body;

        if (!series || !Array.isArray(series) || series.length === 0) {
            return res.status(400).json({ message: "Debe proporcionar al menos un número de serie." });
        }

        const resultado = await TonerService.registrarLote({ modelo, cliente_id, series });

        res.status(201).json(resultado);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
