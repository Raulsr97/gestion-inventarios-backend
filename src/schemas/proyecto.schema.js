const Joi = require('joi');

const crearProyectoSchema = Joi.object({
    nombre: Joi.string().min(3).max(50).required()
});

module.exports = { crearProyectoSchema };
