const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path')
dotenv.config();

const { logErrors, ormErrorHandler, errorHandler, boomErrorHandler } = require('../middlewares/error.handler');
const routerApi = require('./routes'); // Carga de rutas centralizada

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estaticos 
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Middlewares
app.use(cors());
app.use(express.json()); // Ya no necesitamos body-parser

// Rutas
routerApi(app); // Centraliza todas las rutas

// Middlewares de error (se cargan después de las rutas)
app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

// Servidor escuchando
app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
});
