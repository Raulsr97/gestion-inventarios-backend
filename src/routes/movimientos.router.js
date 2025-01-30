const express = require('express')
const MovimientosService = require('../services/movimientos.service')
const router = express.Router()
const service = new MovimientosService

router.get('/ingresados', async (req, res, next) => {
    try {
        const { fecha } = req.query
        if (!fecha) {
            return res.status(400).json({ message: 'La fecha es requerida en el formato YYYY-MM-DD'})
        }

        const products = await service.productsIn(fecha)
        if(products.length === 0) {
            return res.json({ message: 'No se encontraron productos con esta fecha'})
        }

        res.status(200).json(products)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
    }
})

router.get('/salidos', async (req, res) => {
    try {
        const { fecha } = req.query
        if(!fecha) {
            return res.status(400).json({ message: 'La fecha es requerida en el formato YYYY-MM-DD'})
        }
        
        const products = await service.productsOut(fecha)
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