const express = require('express');
const router = express.Router();
const EmpresaService = require('../services/empresa.service');

router.get('/', async (req, res) => {
    try {
        const empresas = await EmpresaService.obtenerEmpresas();
        res.json(empresas);
    } catch (error) {
        console.error("Error en la solicitud de empresas:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
