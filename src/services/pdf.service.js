const puppeteer = require('puppeteer')

class PDFService {
    async generarPdf(numero_remision) {
        try {
          console.log("📄 Número de remisión recibido en servicio PDF:", numero_remision);
          const url = (`http://localhost:5173/vista-remision/${numero_remision}`)

          const browser = await puppeteer.launch({ headless: true })
          const page = await browser.newPage()

          // Configurar página
          await page.setViewport({ width: 1280, height: 900 })

          // Navegar a la vista previa
          await page.goto(url, { waitUntil: 'networkidle2'})

          // Ocultar botones de confirmacion y modificacion 
          await page.evaluate(() => {
            document.querySelector('button#confirmar-remision')?.remove()
            document.querySelector('button#modificar-remision')?.remove()
          })

          // Generar PDF con ajustes
          const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20mm', right: '10mm', bottom: '20mm', left: '10mm'}
          })

          await browser.close()

          console.log("✅ PDF generado con éxito para:", numero_remision);
          return Buffer.from(pdfBuffer)
        } catch (error) {
          console.error("❌ Error al generar el PDF:", error);
          throw new Error("No se pudo generar el PDF.");
        }

        
    }
}

module.exports = new PDFService()