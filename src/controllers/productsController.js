const Product = require('../models/Product.model');

   // Obtener todos los productos
   const getAllProducts = async (req, res) => {
     try {
       const products = await Product.findAll();
       res.status(200).json(products);
     } catch (err) {
       res.status(500).send(err);
     }
   };

   // Agregar un producto
   const addProduct = async (req, res) => {
     const { numero_serie, tipo, proveedor, cliente, fecha_entrada } = req.body;
     try {
       await Product.create({ numero_serie, tipo, proveedor, cliente, fecha_entrada });
       res.status(201).send('Producto agregado con éxito');
     } catch (err) {
       res.status(500).send(err);
     }
   };

   module.exports = { getAllProducts, addProduct };