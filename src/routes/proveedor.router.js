const express = require('express');
const ProveedorService = require('../services/proveedor.service');
const { crearProveedorSchema } = require('../schemas/proveedor.schema');
const validatorHandler = require('../../middlewares/validator.handler');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const proveedores = await ProveedorService.obtenerProveedores();
        res.json(proveedores);
    } catch (error) {
        next(error);
    }
});

router.post('/', validatorHandler(crearProveedorSchema, 'body'), async (req, res, next) => {
    try {
        const nuevoProveedor = await ProveedorService.crearProveedor(req.body);
        res.status(201).json(nuevoProveedor);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
