const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')
const models = require('../models')

const generarPDF = (remision) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        let buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(buffers);
            resolve(pdfBuffer);
        });

        // Encabezado con logo y empresa
        const logoPath = remision.empresa_id === 1 ? 'public/logos/imme.png' :
                         remision.empresa_id === 2 ? 'public/logos/colour_klub.png' :
                         'public/logos/coneltec.png';
        
        doc.image(logoPath, 50, 50, { width: 100 });
        doc.fontSize(16).fillColor('#333').text('REMISIÓN ENTREGA', 200, 50, { align: 'center' });
        doc.fontSize(10).fillColor('#777').text(`Número: ${remision.numero_remision}`, { align: 'right' });
        
        doc.moveDown(2);

        // Datos de la remisión
        doc.fontSize(12).fillColor('#000');
        doc.text(`Cliente: ${remision.cliente.nombre || 'Sin cliente'}`);
        doc.text(`Proyecto: ${remision.proyecto ? remision.proyecto.nombre : 'Sin proyecto'}`);
        doc.text(`Sitio: ${remision.destinatario}`);
        doc.text(`Dirección de Entrega: ${remision.direccion_entrega}`);
        doc.text(`Notas: ${remision.notas || 'Sin notas'}`);

        doc.moveDown(2);

        // Tabla de series
        doc.fontSize(12).fillColor('#000').text('Lista de Equipos:', { underline: true });
        doc.moveDown(1);

        const startX = 50;
        let startY = doc.y;
        const columnWidths = [100, 100, 150, 150];

        doc.fontSize(10).fillColor('#000');
        doc.text('Marca', startX, startY, { width: columnWidths[0] });
        doc.text('Modelo', startX + columnWidths[0], startY, { width: columnWidths[1] });
        doc.text('Serie', startX + columnWidths[0] + columnWidths[1], startY, { width: columnWidths[2] });
        doc.text('Accesorios', startX + columnWidths[0] + columnWidths[1] + columnWidths[2], startY, { width: columnWidths[3] });

        doc.moveDown(0.5);
        remision.series.forEach((serie) => {
            doc.text(serie.marca || 'N/A', startX);
            doc.text(serie.modelo || 'N/A', startX + columnWidths[0]);
            doc.text(serie.serie, startX + columnWidths[0] + columnWidths[1]);
            doc.text(serie.accesorios ? serie.accesorios.join(', ') : 'Sin accesorios', startX + columnWidths[0] + columnWidths[1] + columnWidths[2]);
            doc.moveDown(0.5);
        });

        doc.moveDown(2);

        // Firmas
        doc.text('Firma de quien recibe', 50, doc.y);
        doc.text('__________________________', 50, doc.y + 15);
        doc.text('Nombre y Firma', 50, doc.y + 30);

        doc.text('Firma de quien entrega', 350, doc.y - 45);
        doc.text('__________________________', 350, doc.y - 30);
        doc.text('Nombre y Firma', 350, doc.y - 15);

        doc.end();
    });
};

module.exports = { generarPDF };

  
  
  module.exports = { generarPDF };