const express = require('express')
const router = express.Router()
const remisionUnidadImgService = require('../services/remisionUnidadImg.service')
const PDFService = require('../services/pdf.service')
const uploadEvidencia = require('../../middlewares/uploadEvidencia')

// Obtener todas las remisiones
router.get('/total', async(req, res) => {
  try {
    const remisiones = await remisionUnidadImgService.obtenerTodasRemisiones()
    res.status(200).json(remisiones)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})


// Crear una nueva remision
router.post('/', async (req, res) => {
    try {
        const nuevaRemision = await remisionUnidadImgService.crearRemision(req.body)
        res.status(201).json(nuevaRemision)
    } catch (error) {
        next(error)
    }
})

// Cancelar una remisión 
router.patch('/:numero_remision/cancelar', async (req, res) => {
  try {
    const { numero_remision } = req.params
    const { usuario_cancelacion } = req.body 

    const usuarioCancelacion = usuario_cancelacion || 'admin'

    const resultado = await remisionUnidadImgService.cancelarRemision(numero_remision, usuarioCancelacion)

    res.status(200).json(resultado)
  } catch (error) {
    console.error("❌ Error al cancelar remisión:", error.message);
    res.status(400).json({ error: error.message });
  }
})
  
// Confirmar la entrega de una remisión
router.put('/:numero_remision/confirmar', async (req, res) => {
    try {
      const resultado = await remisionUnidadImgService.confirmarEntregaRemision(req.params.numero_remision);
      res.json(resultado);
    } catch (error) {
      next(error)
    }
});
  
// Buscar remisiones con filtros
router.get('/', async (req, res, next) => {
    try {
      const filtros = req.query;
      const remisiones = await remisionUnidadImgService.buscarRemisiones(filtros);
      res.json(remisiones);
    } catch (error) {
      next(error)
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

// Obtener una remision por numero de remision
router.get("/:numero_remision", async (req, res) => {
  try {
      const { numero_remision } = req.params;
      console.log("📩 Buscando remisión con número:", numero_remision);

      const remision = await remisionUnidadImgService.obtenerRemisionPorNumero(numero_remision);

      res.json(remision);
  } catch (error) {
      res.status(404).json({ error: error.message });
  }
});

// Router para subir archivo de evidencia
router.post('/:numero_remision/evidencia', uploadEvidencia.single('archivo'), async (req, res) => {
  try {
    console.log("📤 Archivo recibido:", req.file); // <- esto debería verse
    const { numero_remision } = req.params

    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningun archivo'})
    }

    const nombreArchivo = `remisiones_firmadas/${req.file.filename}` // ruta relativa al archivo

    const remisionActualizada = await remisionUnidadImgService.subirEvidencia(numero_remision, nombreArchivo)

    res.status(200).json({
      message: 'Evidencia subida correctamente',
      remision: remisionActualizada
    })
  } catch (error) {
    console.error("❌ Error en el endpoint de evidencia:", error.message)
    res.status(500).json({ error: 'Error al subir evidencia' })
  }
})

// Modificar la fecha programada de una remision de entrega
router.patch('/:numero_remision/fecha-programada', async (req, res) => {
  try {
    const { numero_remision } = req.params
    const { nuevaFecha } = req.body

    const resultado = await remisionUnidadImgService.modificarFechaProgramada(numero_remision, nuevaFecha)

    res.status(200).json(resultado)
  } catch (error) {
    console.error("❌ Error al modificar la fecha:", error.message);
    res.status(400).json({ error: error.message });
  }
})

module.exports = router;