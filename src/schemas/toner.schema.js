const Joi = require('joi');

const crearTonerSchema = Joi.object({
    numero_serie: Joi.string().min(5).max(50).required(),
    modelo: Joi.string().min(3).max(50).required(),
    cliente_id: Joi.number().integer().optional().allow(null),
    fecha_ingreso: Joi.date().default(Date.now)
});

module.exports = { crearTonerSchema };
