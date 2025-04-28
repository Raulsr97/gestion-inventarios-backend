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

router.get('/disponibles-remision', async (req, res, next) => {
    try {
      const resultado = await RefaccionService.obtenerRefaccionesDisponiblesParaRemision();
      res.json(resultado);
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

// GET /refacciones/historial-entradas
router.get('/historial-entradas', async (req, res, next) => {
    try {
      const mes = req.query.mes;
      const resultado = await RefaccionService.obtenerHistorialEntradasAgrupado(mes);
      res.json(resultado);
    } catch (error) {
      next(error);
    }
  });

// GET /refacciones/historial-salidas
router.get('/historial-salidas', async (req, res, next) => {
  try {
    const mes = req.query.mes;
    const resultado = await RefaccionService.obtenerHistorialSalidasRefacciones(mes);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
});

router.get('/historial-entradas/meses', async (req, res, next) => {
  try {
    const resultado = await RefaccionService.obtenerMesesDisponiblesEntradas();
    res.json(resultado);
  } catch (error) {
    next(error);
  }
});


router.get('/historial-salidas/meses', async (req, res, next) => {
  try {
    const meses = await RefaccionService.obtenerMesesDisponiblesSalidas();
    res.json(meses);
  } catch (error) {
    next(error);
  }
});



module.exports = router;
