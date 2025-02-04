const express = require('express');
const UnidadImagenService = require('../services/unidadImagen.service');
const { crearUnidadImagenSchema } = require('../schemas/unidadImagen.schema');
const validatorHandler = require('../../middlewares/validator.handler');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const unidadesImagen = await UnidadImagenService.obtenerUnidadesImagen();
        res.json(unidadesImagen);
    } catch (error) {
        next(error);
    }
});

router.post('/', validatorHandler(crearUnidadImagenSchema, 'body'), async (req, res, next) => {
    try {
        const nuevaUnidadImagen = await UnidadImagenService.crearUnidadImagen(req.body);
        res.status(201).json(nuevaUnidadImagen);
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

        const resultado = await UnidadImagenService.registrarLote({ modelo, cliente_id, series });

        res.status(201).json(resultado);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
