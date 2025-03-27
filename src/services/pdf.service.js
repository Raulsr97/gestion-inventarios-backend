const puppeteer = require('puppeteer');
const { obtenerRemisionPorNumero } = require('./remision.service');

class PDFService {
    async generarPdf(numero_remision, fechaVisual) {
        const remision = await obtenerRemisionPorNumero(numero_remision)

        // Si se recibe una fecha visual, reemplazamos temporalmente la fecha_emision
        if (fechaVisual) {
          remision.fecha_emision = fechaVisual
        }

        try {
          console.log("📄 Número de remisión recibido en servicio PDF:", numero_remision);
          const url = `http://localhost:5173/vista-remision/${numero_remision}?fecha=${encodeURIComponent(fechaVisual || "")}`


          const browser = await puppeteer.launch({ headless: true })
          const page = await browser.newPage()

          // Configurar página
          await page.setViewport({ width: 1280, height: 900 })

          // Navegar a la vista previa
          await page.goto(url, { waitUntil: 'networkidle2'})
          await page.waitForSelector('#vista-remision-imme', { timeout: 30000 })

          // Esperar que tenga contenido visible
          await page.waitForFunction(() => {
            const container = document.querySelector('#vista-remision-imme')
            return container && container.innerText.length > 100
          }, { timeout: 30000 })

          
          await page.addStyleTag({
            content: `
            #vista-remision-imme {
              break-inside: auto;
              page-break-inside: auto;
              display: block;
              overflow: visible;
            }

            table, tr, td, th {
              break-inside: auto !important;
              page-break-inside: auto !important;
            }

            thead {
              display: table-header-group;
            }

            tfoot {
              display: table-footer-group;
            }
            `
          });

          // Espera adicional para asegurar que todo se aplique
          await new Promise(resolve => setTimeout(resolve, 1000))


          // Ocultar botones de confirmacion y modificacion 
          await page.evaluate(() => {
            document.querySelector('button#confirmar-remision')?.remove()
            document.querySelector('button#modificar-remision')?.remove()
          })

          // Generar PDF con ajustes
          const pdfBuffer = await page.pdf({
            format: 'letter',
            printBackground: true,
            preferCSSPageSize: true,
            margin: { top: '5mm', right: '10mm', bottom: '5mm', left: '10mm'}
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