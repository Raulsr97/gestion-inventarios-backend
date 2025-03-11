const express = require('express')
const router = express.Router()
const remisionService = require('../services/remision.service')
const validatorHandler = require('../../middlewares/validator.handler');
const { crearRemisionSchema, cancelarRemisionSchema, confirmarEntregaSchema } = require('../schemas/remision.schema')
const { generarPDF } = require('../services/pdf.service')
const path = require("path")

// Obtener todas las remisiones
router.get('/total', async(req, res) => {
  try {
    const remisiones = await remisionService.obtenerTodasRemisiones()
    res.status(200).json(remisiones)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})


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

// Obtener una remision por numero de remision
router.get("/:numero_remision", async (req, res) => {
  try {
      const { numero_remision } = req.params;
      console.log("📩 Buscando remisión con número:", numero_remision);

      const remision = await remisionService.obtenerRemisionPorNumero(numero_remision);

      res.json(remision);
  } catch (error) {
      res.status(404).json({ error: error.message });
  }
});

// pdfs
router.get('/pdf/:numero_remision', async (req, res) => {
  console.log("📩 Parámetros recibidos:", req.params);

  try {
      const numeroRemision = req.params.numero_remision; // ✅ Obtener el parámetro correctamente

      if (!numeroRemision) {
          return res.status(400).json({ error: "Número de remisión requerido." });
      }

      const pdfBuffer = await generarPDF(numeroRemision);

      res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=${numeroRemision}.pdf`
      });
      res.send(pdfBuffer);

  } catch (error) {
      console.error("❌ Error al descargar el PDF:", error);
      res.status(500).json({ error: "No se pudo generar el PDF." });
  }
});

  
  module.exports = router;