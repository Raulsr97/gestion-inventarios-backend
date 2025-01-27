const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { logErrors, ormErrorHandler, errorHandler, boomErrorHandler} = require('../middlewares/error.handler')

   
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
const productsRoutes = require('./routes/products.router');
app.use('/api/products', productsRoutes);

// middlewares de error
app.use(logErrors)
app.use(ormErrorHandler)
app.use(boomErrorHandler)
app.use(errorHandler)

// Servidor escuchando
app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
});