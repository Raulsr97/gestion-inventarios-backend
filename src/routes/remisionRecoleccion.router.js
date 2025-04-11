const express = require('express')
const router = express.Router()
const remisionRecoleccionService = require('../services/remisionRecoleccion.service')
const PDFService = require('../services/pdf.service')
const uploadEvidencia = require('../../middlewares/uploadEvidencia')


// Obtener todas las remisiones
router.get('/total', async(req, res) => {
  try {
    const remisiones = await remisionRecoleccionService.obtenerTodasLasRemisiones()
    res.status(200).json(remisiones)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// Crear una nueva remision
router.post('/', async (req, res, next) => {
    try {
        const nuevaRemision = await remisionRecoleccionService.crearRemision(req.body)
        res.status(201).json(nuevaRemision)
    } catch (error) {
        next(error)
    }
})

// Cancelar una remisión 
router.patch('/:numero_remision/cancelar', async (req, res) => {
  try {
    const { numero_remision } = req.params
    const { usuario } = req.body 

    const usuarioCancelacion = usuario || 'admin'

    const resultado = await remisionRecoleccionService.cancelarRemision(numero_remision, usuarioCancelacion)

    res.status(200).json(resultado)
  } catch (error) {
    console.error("❌ Error al cancelar remisión:", error.message);
    res.status(400).json({ error: error.message });
  }
})

// Buscar remisiones con filtros
router.get('/', async (req, res, next) => {
    try {
      const filtros = req.query;
      const remisiones = await remisionRecoleccionService.buscarRemisiones(filtros);
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

      const remision = await remisionRecoleccionService.obtenerRemisionPorNumero(numero_remision);

      res.json(remision);
  } catch (error) {
      res.status(404).json({ error: error.message });
  }
})

// Router para descargar el PDF
router.get('/generar-pdf/:numero_remision', async (req, res) => {
  const { numero_remision } = req.params
  const fechaVisual = req.query.fecha 

  console.log("📥 Solicitud para generar PDF de la remisión:", numero_remision);
  try {
    const pdfBuffer = await PDFService.generarPdfRecoleccion(numero_remision, fechaVisual)
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

// Router para subir archivo de evidencia
router.post('/:numero_remision/evidencia', uploadEvidencia.single('archivo'), async (req, res) => {
  try {
    console.log("📤 Archivo recibido:", req.file); // <- esto debería verse
    const { numero_remision } = req.params

    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningun archivo'})
    }

    const nombreArchivo = `remisiones_firmadas/${req.file.filename}` // ruta relativa al archivo

    const remisionActualizada = await remisionRecoleccionService.subirEvidencia(numero_remision, nombreArchivo)

    res.status(200).json({
      message: 'Evidencia subida correctamente',
      remision: remisionActualizada
    })
  } catch (error) {
    console.error("❌ Error en el endpoint de evidencia:", error.message)
    res.status(500).json({ error: 'Error al subir evidencia' })
  }
})

module.exports = router
