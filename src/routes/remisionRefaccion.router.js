const express = require('express')
const router = express.Router()
const remisionRefaccionService = require('../services/remisionRefaccion.service')
const PDFService = require('../services/pdf.service')
const uploadEvidencia = require('../../middlewares/uploadEvidencia')

router.post('/', async (req, res, next) => {
  try {
    const resultado = await remisionRefaccionService.crearRemision(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
});

router.get('/:numero_remision', async (req, res, next) => {
  try {
    const remision = await remisionRefaccionService.obtenerRemisionPorNumero(req.params.numero_remision);
    
    // Aseguramos que venga con la propiedad `refacciones`
    res.json({
      ...remision.toJSON(), // Importante para que venga como objeto plano
      refacciones: remision.refacciones || []
    });
  } catch (error) {
    console.error("❌ Error al obtener la remisión de refacciones:", error.message);
    res.status(404).json({ error: 'Remisión no encontrada' });
  }
})

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

module.exports = router