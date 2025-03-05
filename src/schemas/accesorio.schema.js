const Joi = require('joi');

const id = Joi.number().integer();
const numero_parte = Joi.string().min(2).max(50).required();
const cantidad = Joi.number().integer().min(0).required();

const crearAccesorioSchema = Joi.object({
    numero_parte,
    cantidad
});

const actualizarAccesorioSchema = Joi.object({
    numero_parte: numero_parte.optional(),
    cantidad: cantidad.optional()
});

module.exports = { crearAccesorioSchema, actualizarAccesorioSchema };
