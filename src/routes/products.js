const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// Endpoints básicos
router.get('/', productsController.getAllProducts);
router.post('/', productsController.addProduct);

module.exports = router;