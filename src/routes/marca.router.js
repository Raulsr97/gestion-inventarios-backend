const express = require('express');
const MarcaService = require('../services/marca.service');
const { crearMarcaSchema } = require('../schemas/marca.schema');
const validatorHandler = require('../../middlewares/validator.handler');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const marcas = await MarcaService.obtenerMarcas();
        res.json(marcas);
    } catch (error) {
        next(error);
    }
});

router.post('/', validatorHandler(crearMarcaSchema, 'body'), async (req, res, next) => {
    try {
        const nuevaMarca = await MarcaService.crearMarca(req.body);
        res.status(201).json(nuevaMarca);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
