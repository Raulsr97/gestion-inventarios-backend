const Joi = require('joi');

const crearImpresoraSchema = Joi.object({
    serie: Joi.string().min(5).max(50).required(),
    modelo: Joi.string().min(3).max(50).required(),
    proveedor: Joi.string().optional(),
    estado: Joi.string().valid('Nueva', 'Usada').required(),
    tipo: Joi.string().valid('Propia', 'Proyecto', 'Usada').required(),
    ubicacion: Joi.string().valid('Almacén', 'Cliente', 'Devuelto al fabricante').required(),
    cliente_id: Joi.number().integer().optional().allow(null),
    proyecto_id: Joi.number().integer().optional().allow(null),
    tiene_accesorios: Joi.boolean().default(false),
    fecha_entrada: Joi.date().default(Date.now)
});

module.exports = { crearImpresoraSchema };
