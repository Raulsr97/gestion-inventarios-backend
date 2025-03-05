const express = require('express');
const AccesorioService = require('../services/accesorio.service');
const validatorHandler = require('../../middlewares/validator.handler');
const { crearAccesorioSchema, actualizarAccesorioSchema } = require('../schemas/accesorio.schema');

const router = express.Router();
const service = new AccesorioService();

router.get('/', async (req, res, next) => {
    try {
        const accesorios = await service.obtenerAccesorios();
        res.json(accesorios);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const accesorio = await service.obtenerPorId(req.params.id);
        res.json(accesorio);
    } catch (error) {
        next(error);
    }
});

router.post('/',
    validatorHandler(crearAccesorioSchema, 'body'),
    async (req, res, next) => {
        try {
            const accesorio = await service.crearAccesorio(req.body);
            res.status(201).json(accesorio);
        } catch (error) {
            next(error);
        }
    }
);

router.put('/:id',
    validatorHandler(actualizarAccesorioSchema, 'body'),
    async (req, res, next) => {
        try {
            const accesorio = await service.actualizarAccesorio(req.params.id, req.body);
            res.json(accesorio);
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/:id', async (req, res, next) => {
    try {
        const mensaje = await service.eliminarAccesorio(req.params.id);
        res.json(mensaje);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
