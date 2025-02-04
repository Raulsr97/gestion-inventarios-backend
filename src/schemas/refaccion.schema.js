const Joi = require('joi');

const crearRefaccionSchema = Joi.object({
    numero_parte: Joi.string().min(3).max(50).required(),
    cantidad: Joi.number().integer().min(1).required(),
    fecha_ingreso: Joi.date().default(Date.now)
});

module.exports = { crearRefaccionSchema };
