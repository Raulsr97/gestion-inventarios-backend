const express = require('express')
const router = express.Router()
const remisionesCombinadasService = require('../services/remisionesCombinadas.service')

// Buscar remisiones combinadas
router.get('/', async (req, res) => {
  try {
    const filtros = req.query
    const remisiones = await remisionesCombinadasService.buscarRemisionesCombinadas(filtros)
    res.status(200).json(remisiones)
  } catch (error) {
    console.error("❌ Error al buscar remisiones combinadas:", error.message);
    res.status(500).json({ error: 'Error al buscar remisiones' });
  }
})

module.exports = router