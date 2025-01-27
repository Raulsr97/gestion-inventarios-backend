const Joi = require('joi');

const serie = Joi.string()
const modelo = Joi.string()
const tipo = Joi.string()
const proveedor = Joi.string()
const cliente = Joi.string()
const fechaEntrada = Joi.date().iso()
const fechaSalida = Joi.date().iso()


// Producto agregado
const createproductSchema = Joi.object({
  serie: serie.required(),
  modelo: modelo.required(),
  tipo: tipo.required(),
  proveedor: proveedor.required(),
  fecha_entrada: fechaEntrada.required(),
  
});

// Dar salida al producto
const updateProductSchema = Joi.object({
    cliente: cliente.optional(),
})

// Consultar un producto en especifico
const getProductSchema = Joi.object({
    serie: serie.required()
})

// borrado logico de un producto
const deleteProductSchema = Joi.object({
    serie: serie.required()
})


module.exports = { createproductSchema, getProductSchema, updateProductSchema, deleteProductSchema }


