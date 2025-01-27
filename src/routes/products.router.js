const express = require('express');
const ProductsService = require('../services/products.service');
const validatorHandler = require('../../middlewares/validator.handler')
const { getProductSchema, updateProductSchema, createproductSchema, deleteProductSchema} = require('../schemas/product.schema')

const router = express.Router();
const service = new ProductsService()

// Endpoints básicos
router.get('/', async (req, res) => {
    try {
        const products = await service.find()
        res.json(products)
    } catch (error) {
        next(error)
    }
});

router.get('/:serie',
    validatorHandler(getProductSchema, 'params'),
    async (req, res, next) => {
        const { serie } = req.params
        const product = await service.findOne(serie)
        res.json(product)
    }
)

router.get('/count/:modelo', async (req, res, next) => {
    try {
        const { modelo } = req.params
        const result = await service.countByModel(modelo)
        res.json(result)
    } catch (error) {
        next(error)
    }
})


router.post('/',
    validatorHandler(createproductSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body
            const newProduct = await service.create(body)
            res.status(201).json(newProduct) 
        } catch (error) {
            next(error)
        }
    }
);

router.patch('/:serie', 
    validatorHandler(getProductSchema, 'params'),
    validatorHandler(updateProductSchema, 'body'),
    async (req, res, next) => {
        try {
            const { serie } = req.params
            const body = req.body
            const updatedProduct = await service.update(serie, body)
            res.json(updatedProduct)
        } catch (error) {
            next(error)
        }
    }
)

module.exports = router;