const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Asegurarse de que exista la carpeta donde guardaremos los archivos
const carpetaDestino = path.join(__dirname, '..', 'uploads', 'remisiones_firmadas')
if (!fs.existsSync(carpetaDestino)) {
    fs.mkdirSync(carpetaDestino, { recursive: true })
}

// Configuracion de almacenamiento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, carpetaDestino)
    },
    filename: function (req, file, cb) {
        const numeroRemision = req.params.numero_remision;
        const extension = path.extname(file.originalname); // Esto obtiene ".pdf" o ".jpg"
        const nombreArchivo = `${numeroRemision}${extension}`;
        cb(null, nombreArchivo);
    }
})

// Filtro para aceptar solo pdf, jpg, jpeg, png
const fileFilter = (req, file, cb) => {
    const extensionesPermitidas = /pdf|jpg|jpeg|png/;
    const esValido = extensionesPermitidas.test(path.extname(file.originalname).toLowerCase());
    if (esValido) {
      cb(null, true);
    } else {
      cb(new Error('Formato de archivo no permitido. Solo PDF, JPG, JPEG o PNG.'));
    }
}

const uploadEvidencia = multer({
    storage: storage,
    fileFilter: fileFilter
})

module.exports = uploadEvidencia

