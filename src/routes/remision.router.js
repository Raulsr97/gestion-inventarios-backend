const express = require('express')
const router = express.Router()
const remisionService = require('../services/remision.service')
const PDFService = require('../services/pdf.service')
const validatorHandler = require('../../middlewares/validator.handler');
const { crearRemisionSchema, cancelarRemisionSchema, confirmarEntregaSchema } = require('../schemas/remision.schema')


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

// Router para descargar el PDF
router.get('/generar-pdf/:numero_remision', async (req, res) => {
  const { numero_remision } = req.params
  const fechaVisual = req.query.fecha 

  console.log("📥 Solicitud para generar PDF de la remisión:", numero_remision);
  try {
    const pdfBuffer = await PDFService.generarPdf(numero_remision, fechaVisual)
    console.log("📄 PDF generado correctamente.");

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=remision_${numero_remision}.pdf`
    })

    console.log("📄 Tamaño del PDF (bytes):", pdfBuffer.length)
    console.log("📂 Tipo de pdfBuffer:", typeof pdfBuffer)
    console.log("📏 Es buffer:", Buffer.isBuffer(pdfBuffer))
    res.send(pdfBuffer)
  } catch (error) {
    console.error("❌ Error al generar el PDF:", error.message)
    res.status(500).json({ error: "No se pudo generar el PDF." })
  }
})


  
  module.exports = router;