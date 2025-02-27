const Joi = require('joi');

const crearProveedorSchema = Joi.object({
    nombre: Joi.string().min(3).max(50).required()
});

module.exports = { crearProveedorSchema };
