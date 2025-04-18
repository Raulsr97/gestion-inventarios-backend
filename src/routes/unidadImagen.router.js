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

router.post('/registro-lote', async (req, res, next) => {
    try {
      const resultado = await UnidadImagenService.registrarLoteUnidadesImagen(req.body);
      res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
});

router.get('/almacen-por-tipo', async (req, res, next) => {
    try {
      const datos = await UnidadImagenService.contarPorTipoEnAlmacen();
      res.json(datos);
    } catch (error) {
      next(error);
    }
});

router.get('/movimientos-mes', async (req, res, next) => {
    try {
      const movimientos = await UnidadImagenService.obtenerMovimientosdelMes();
      res.json(movimientos);
    } catch (error) {
      next(error);
    }
});
  
module.exports = router;
