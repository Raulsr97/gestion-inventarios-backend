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

router.post('/registro-lote', async (req, res, next) => {
    try {
      const resultado = await RefaccionService.registrarLoteRefacciones(req.body);
      res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
});

router.get('/stock-agrupado', async (req, res) => {
    try {
        const data = await RefaccionService.obtenerStockAgrupado()
        res.json(data)
    } catch (error) {
        console.error('❌ Error al obtener el stock agrupado:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
})

module.exports = router;
