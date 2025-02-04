const Joi = require('joi');

const crearClienteSchema = Joi.object({
    nombre: Joi.string().min(3).max(50).required()
});

module.exports = { crearClienteSchema };
