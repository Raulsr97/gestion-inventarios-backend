const express = require('express')
const router = express.Router()
const remisionService = require('../services/remision.service')
const validatorHandler = require('../../middlewares/validator.handler');
const { crearRemisionSchema, cancelarRemisionSchema, confirmarEntregaSchema } = require('../schemas/remision.schema')


// Crear una nueva remision
router.post('/', validatorHandler(crearRemisionSchema, 'body'), async (req, res, next) => {
    try {
        const nuevaRemision = await remisionService.crearRemision(req.body)
        res.status(201).json(nuevaRemision)
    } catch (error) {
        next(error)
    }
})

// Cancelar una remisión por su número
router.delete('/:numero_remision', validatorHandler(cancelarRemisionSchema, 'body'),  async (req, res, next) => {
    try {
      const resultado = await remisionService.cancelarRemision(req.params.numero_remision);
      res.json(resultado);
    } catch (error) {
      next(error)
    }
 
});
  
// Confirmar la entrega de una remisión
router.put('/:numero_remision/confirmar', validatorHandler(confirmarEntregaSchema, 'body'), async (req, res, next) => {
    try {
      const resultado = await remisionService.confirmarEntregaRemision(req.params.numero_remision);
      res.json(resultado);
    } catch (error) {
      next(error)
    }
});
  
// Buscar remisiones con filtros
router.get('/', async (req, res, next) => {
    try {
      const filtros = req.query;
      const remisiones = await remisionService.buscarRemisiones(filtros);
      res.json(remisiones);
    } catch (error) {
      next(error)
    }
});  
  
  module.exports = router;