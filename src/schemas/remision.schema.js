const Joi = require('joi');

const numero_remision = Joi.string().required();
const empresa_id = Joi.number().integer().required();
const cliente_id = Joi.number().integer().allow(null);
const proyecto_id = Joi.number().integer().allow(null);
const destinatario = Joi.string().required();
const direccion_entrega = Joi.string().required();
const notas = Joi.string().allow(null);
const estado = Joi.string().valid('Pendiente', 'Cancelada', 'Confirmada').default('Pendiente');
const remision_firmada = Joi.string().allow(null);
const observaciones_entrega = Joi.string().allow(null);
const usuario_creador = Joi.string().allow(null);
const usuario_entrega = Joi.string().allow(null);
const fecha_entrega = Joi.date().allow(null);
const cancelada_por = Joi.string().allow(null);
const fecha_cancelacion = Joi.date().allow(null);
const series = Joi.array().items(Joi.string()).min(1).required(); // Debe haber al menos 1 serie
const fecha_programada = Joi.date().allow(null)

// 📌 Esquema para validar la creación de una remisión
const crearRemisionSchema = Joi.object({
  numero_remision,
  empresa_id,
  cliente_id,
  proyecto_id,
  destinatario,
  direccion_entrega,
  notas,
  usuario_creador,
  series,
  fecha_programada
});

// 📌 Esquema para validar la cancelación de una remisión
const cancelarRemisionSchema = Joi.object({
  usuario_creador,
  cancelada_por: Joi.string().required(),
  fecha_cancelacion: Joi.date().required(),
});

// 📌 Esquema para validar la confirmación de entrega de una remisión
const confirmarEntregaSchema = Joi.object({
  usuario_entrega: Joi.string().required(),
  fecha_entrega: Joi.date().required(),
  observaciones_entrega
});

module.exports = { crearRemisionSchema, cancelarRemisionSchema, confirmarEntregaSchema };
