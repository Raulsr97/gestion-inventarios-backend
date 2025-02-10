const Joi = require('joi');

const crearMarcaSchema = Joi.object({
    nombre: Joi.string().min(2).max(50).required()
});

module.exports = { crearMarcaSchema };