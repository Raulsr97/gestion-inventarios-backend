const express = require('express');
const ClienteService = require('../services/cliente.service');
const { crearClienteSchema } = require('../schemas/cliente.schema');
const validatorHandler = require('../../middlewares/validator.handler');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const clientes = await ClienteService.obtenerClientes();
        res.json(clientes);
    } catch (error) {
        next(error);
    }
});

router.post('/', validatorHandler(crearClienteSchema, 'body'), async (req, res, next) => {
    try {
        const nuevoCliente = await ClienteService.crearCliente(req.body);
        res.status(201).json(nuevoCliente);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
