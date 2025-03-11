const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')
const models = require('../models')
const remisionService = require('./remision.service')

const generarPDF = async (numero_remision) => {
    try {
        const remision = await remisionService.obtenerRemisionPorNumero(numero_remision);
        if (!remision) throw new Error("No se encontró la remisión.");

        console.log("📌 Datos de la remisión obtenidos:", remision);

        const empresaNombre = remision?.empresa?.nombre || "Sin empresa";
        const clienteNombre = remision?.cliente?.nombre || "Sin cliente";
        const proyectoNombre = remision?.proyecto?.nombre || "Sin proyecto";
        const destinatario = remision?.destinatario || "No especificado";
        const direccionEntrega = remision?.direccion_entrega || "No especificado";
        const notas = remision?.notas || "Sin notas";
        const fechaEmision = remision?.fecha_emision
            ? new Date(remision.fecha_emision).toLocaleDateString("es-MX")
            : "No registrada";

        // 🔹 Definir los estilos de cada empresa
        const estilosEmpresas = {
            "IMME": { color: "blue", logo: "imme.png", borderColor: "#1d4ed8" },
            "Colour Klub": { color: "blue", logo: "colour_klub.png", borderColor: "#2563eb" },
            "Coneltec": { color: "orange", logo: "coneltec.png", borderColor: "#ea580c" }
        };

        const estilo = estilosEmpresas[empresaNombre] || estilosEmpresas["IMME"];
        const logoPath = path.join(__dirname, `../assets/logos/${estilo.logo}`);

        const doc = new PDFDocument({ margin: 50 });
        let pdfBuffer = [];

        return new Promise((resolve, reject) => {
            doc.on("data", (chunk) => pdfBuffer.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(pdfBuffer)));
            doc.on("error", (err) => reject(err));

            // 🖼️ Encabezado con logo y título
            if (fs.existsSync(logoPath)) {
                doc.image(logoPath, 50, 30, { width: 80 });
            }

            doc.fillColor(estilo.borderColor).fontSize(18).text("REMISIÓN ENTREGA", { align: "center" });

            // 🔹 Número de Remisión (discreto arriba a la derecha)
            doc.fontSize(10).fillColor("gray").text(`No. Remisión: ${numero_remision}`, { align: "right" });

            doc.moveDown(1.5);

            // 📄 Información de la remisión dentro de un recuadro
            doc.lineWidth(2).strokeColor(estilo.borderColor)
                .rect(50, doc.y, 500, 90)
                .stroke();

            doc.fontSize(12).fillColor("black")
                .text(`Cliente: `, 60, doc.y + 10, { continued: true })
                .fillColor(estilo.borderColor).text(clienteNombre);

            doc.fillColor("black")
                .text(`Proyecto: `, 60, doc.y, { continued: true })
                .fillColor(estilo.borderColor).text(proyectoNombre);

            doc.fillColor("black")
                .text(`📍 Sitio: `, 60, doc.y, { continued: true })
                .fillColor(estilo.borderColor).text(destinatario);

            doc.fillColor("black")
                .text(`📌 Dirección de Entrega: `, 60, doc.y, { continued: true })
                .fillColor(estilo.borderColor).text(direccionEntrega);

            doc.moveDown(2);

            // 🖨️ Tabla de series
            doc.fillColor(estilo.borderColor).fontSize(14).text("Detalles de los productos", { underline: true });
            doc.moveDown(0.5);

            const tableTop = doc.y;
            const col1X = 60;
            const col2X = 250;
            const col3X = 400;

            doc.fillColor("black").fontSize(10);
            doc.text("Marca", col1X, tableTop);
            doc.text("Modelo", col2X, tableTop);
            doc.text("Serie", col3X, tableTop);
            doc.moveDown(0.5);
            doc.lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();

            remision.series?.forEach((serie) => {
                doc.moveDown(0.3);
                doc.text(serie.marca?.nombre || "Desconocida", col1X);
                doc.text(serie.modelo || "Desconocido", col2X);
                doc.text(serie.serie, col3X);
            });

            doc.moveDown();

            // 🔹 Sección de firmas con mismo diseño de la vista previa
            doc.fillColor(estilo.borderColor).fontSize(12).text("Firma de quien recibe", 100, doc.y + 40);
            doc.lineWidth(1).moveTo(90, doc.y + 10).lineTo(250, doc.y + 10).stroke();

            doc.fillColor(estilo.borderColor).text("Firma de quien entrega", 350, doc.y - 15);
            doc.lineWidth(1).moveTo(340, doc.y + 10).lineTo(500, doc.y + 10).stroke();

            doc.end();
        });
    } catch (error) {
        console.error("❌ Error al generar el PDF:", error.message);
        throw new Error("No se pudo generar el PDF.");
    }
};


module.exports = { generarPDF };

  
  
  module.exports = { generarPDF };