const Joi = require('joi');

const nombre = Joi.string().min(3).max(100).required();
const cliente_id = Joi.number().integer().required(); // Se agrega cliente_id

const crearProyectoSchema = Joi.object({
  nombre,
  cliente_id, 
});

const actualizarProyectoSchema = Joi.object({
  nombre: nombre.optional(),
  cliente_id: cliente_id.optional(),
});

module.exports = { crearProyectoSchema, actualizarProyectoSchema };

