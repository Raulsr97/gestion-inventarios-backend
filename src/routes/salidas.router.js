const express = require('express')
const { obtenerProductosPorFechaSalida } = require('../services/salidas.service')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const { fecha } = req.query
        if(!fecha) {
            return res.status(400).json({ message: 'La fecha es requerida en el formato YYYY-MM-DD'})
        }
        
        const products = await obtenerProductosPorFechaSalida(fecha)
        if(products.length === 0) {
            return res.json({ message: 'No se encontraron productos con esta fecha'})
        }

        res.status(200).json(products)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
    }
})


module.exports = router