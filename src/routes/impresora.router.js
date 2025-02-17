const express = require('express');
const ImpresoraService = require('../services/impresora.service');
const { crearImpresoraSchema } = require('../schemas/impresora.schema');
const validatorHandler = require('../../middlewares/validator.handler');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const impresoras = await ImpresoraService.obtenerImpresoras();
        res.json(impresoras);
    } catch (error) {
        next(error);
    }
});

router.get('/almacen-por-proyecto', async (req, res, next) => {
    try {
        const datos = await ImpresoraService.contarPorProyecto()
        res.json(datos)
    } catch (error) {
       next(error) 
    }
})

router.get('/almacen-por-cliente', async (req, res, next) => {
    try {
        const datos = await ImpresoraService.contarPorCliente()
        res.json(datos)
    } catch (error) {
       next(error) 
    }
})

router.get('/movimientos-mes', async (req, res, next) => {
    try {
        const movimientos = await ImpresoraService.obtenerMovimientosdelMes()
        res.json(movimientos)
    } catch (error) {
        next(error)
    }
})

router.post('/', validatorHandler(crearImpresoraSchema, 'body'), async (req, res, next) => {
    try {
        const nuevaImpresora = await ImpresoraService.crearImpresora(req.body);
        res.status(201).json(nuevaImpresora);
    } catch (error) {
        next(error);
    }
});

router.post('/registrar-lote', async (req, res, next) => {
    try {
        const { modelo, marca_id, estado, tipo, ubicacion, cliente_id, proyecto_id, tiene_accesorios, series } = req.body;

        if (!series || !Array.isArray(series) || series.length === 0) {
            return res.status(400).json({ message: "Debe proporcionar al menos un número de serie." });
        }

        const resultado = await ImpresoraService.registrarLote({
            modelo,
            marca_id,
            estado,
            tipo,
            ubicacion,
            cliente_id,
            proyecto_id,
            tiene_accesorios,
            series
        });

        res.status(201).json(resultado);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
