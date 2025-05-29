const { puppeteer, launchOptions } = require('../../utils/puppeteer');
// Servicios para obtener remisiones según el tipo de producto
const { obtenerRemisionPorNumero: obtenerRemisionImpresora } = require('./remision.service')
const { obtenerRemisionPorNumero: obtenerRemisionToner } = require('./remisionToner.service')
const { obtenerRemisionPorNumero: obtenerRemisionUnidadImagen } = require('./remisionUnidadImg.service')
const { obtenerRemisionPorNumero: obtenerRemisionRefaccion} = require('./remisionRefaccion.service')
const { obtenerRemisionPorNumero: obtenerRemisionRecoleccionPorNumero} = require('./remisionRecoleccion.service')


class PDFService {
    async generarPdf(numero_remision, fechaVisual) {
      let tipo = 'impresora';
      let remision;
      
      try {
        // Intentar con impresoras primero
        remision = await obtenerRemisionImpresora(numero_remision);
        if (remision.toners?.length > 0) tipo = 'toner';
        else if (remision.unidades_imagen?.length > 0) tipo = 'unidad_imagen';
      } catch (e) {
        try {
          remision = await obtenerRemisionToner(numero_remision);
          tipo = 'toner';
        } catch (e2) {
          try {
            remision = await obtenerRemisionUnidadImagen(numero_remision);
            tipo = 'unidad_imagen';
          } catch (e3) {
            try {
              remision = await obtenerRemisionRefaccion(numero_remision);
              tipo = 'refaccion';
            } catch (e4) {
              throw new Error('No se pudo obtener la remisión con ningún tipo conocido.');
            }
          }
        }
      }
      
      
        // Si se recibe una fecha visual, reemplazamos temporalmente la fecha_emision
        if (fechaVisual) {
          remision.fecha_emision = fechaVisual
        }

        try {
          console.log("📄 Número de remisión recibido en servicio PDF:", numero_remision);
          const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
          const url = `${frontendUrl}/vista-remision/${numero_remision}?fecha=${encodeURIComponent(fechaVisual || "")}`;



          const browser = await puppeteer.launch(
            typeof launchOptions === 'function' ? await launchOptions() : launchOptions
          )
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
          console.error("🧪 URL del puppeteer:", url); // <-- agrega esto
          throw new Error("No se pudo generar el PDF.");
        }
    }

    async generarPdfRecoleccion(numero_remision, fechaVisual){
      const remision = await obtenerRemisionRecoleccionPorNumero(numero_remision)

      if (fechaVisual) {
        remision.fecha_emision = fechaVisual
      }

      try {
        console.log("📄 Generando PDF de recolección para:", numero_remision)
    
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const url = `${frontendUrl}/vista-remision/${numero_remision}?fecha=${encodeURIComponent(fechaVisual || "")}`;
    
        const browser = await puppeteer.launch(
          typeof launchOptions === 'function' ? await launchOptions() : launchOptions
        )
        const page = await browser.newPage()
    
        await page.setViewport({ width: 1280, height: 900 })
        await page.goto(url, { waitUntil: 'networkidle2' })
    
        await page.waitForSelector('#vista-remision-imme', { timeout: 30000 })
    
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
        })
    
        await new Promise(resolve => setTimeout(resolve, 1000))
    
        await page.evaluate(() => {
          document.querySelector('button#confirmar-remision')?.remove()
          document.querySelector('button#modificar-remision')?.remove()
        })
    
        const pdfBuffer = await page.pdf({
          format: 'letter',
          printBackground: true,
          preferCSSPageSize: true,
          margin: { top: '5mm', right: '10mm', bottom: '5mm', left: '10mm' }
        })
    
        await browser.close()
    
        console.log("✅ PDF de recolección generado:", numero_remision)
        return Buffer.from(pdfBuffer)
      } catch (error) {
        console.error("❌ Error al generar el PDF de recolección:", error)
        throw new Error("No se pudo generar el PDF de la remisión de recolección.")
      }
    }
}

module.exports = new PDFService()