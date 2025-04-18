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

// Registrar Lote
router.post('/registro-lote', async (req, res, next) => {
    try {
      const resultado = await TonerService.registrarLoteToners(req.body);
      res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
});

router.get('/almacen-por-tipo', async (req, res, next) => {
    try {
      const datos = await TonerService.contarPorTipoEnAlmacen();
      res.json(datos);
    } catch (error) {
      next(error);
    }
});

router.get('/movimientos-mes', async (req, res, next) => {
    try {
      const movimientos = await TonerService.obtenerMovimientosdelMes();
      res.json(movimientos);
    } catch (error) {
      console.error("❌ Error al obtener movimientos del mes (Toner):", error);
      res.status(500).json({ mensaje: "Error interno", error: error.message });
    }
});
  
  

module.exports = router;
