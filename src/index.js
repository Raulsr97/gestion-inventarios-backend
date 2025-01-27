const express = require('express');
   const bodyParser = require('body-parser');
   const cors = require('cors');
   const dotenv = require('dotenv');
   dotenv.config();

   const app = express();
   const PORT = process.env.PORT || 3000;

   // Middlewares
   app.use(cors());
   app.use(bodyParser.json());

   // Rutas
   const productsRoutes = require('./routes/products');
   app.use('/api/products', productsRoutes);

   // Servidor escuchando
   app.listen(PORT, () => {
     console.log(`Server running on http://localhost:${PORT}`);
   });