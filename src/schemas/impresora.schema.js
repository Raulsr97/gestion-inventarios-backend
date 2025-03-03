const Joi = require('joi');

const serie = Joi.string().required();
const marca_id = Joi.number().integer().allow(null);
const modelo = Joi.string().required();
const estado = Joi.string().valid('Nueva', 'Usada').required();
const tipo = Joi.string().valid('Compra', 'Distribucion').required();
const ubicacion = Joi.string().valid('Almacén', 'Entregado', 'Devuelto al proveedor').required();
const cliente_id = Joi.number().integer().allow(null);
const proyecto_id = Joi.number().integer().allow(null);
const tiene_accesorios = Joi.boolean().required();
const fecha_entrada = Joi.date().default(() => new Date());
const fecha_salida = Joi.date().allow(null);
const fecha_entrega_final = Joi.date().allow(null);
const empresa_id = Joi.number().integer().allow(null);
const proveedor_id = Joi.number().integer().allow(null);
const flujo = Joi.string().valid('Recolección', 'Distribución').allow(null);
const origen_recoleccion = Joi.string().allow(null); 
const destino_distribucion = Joi.string().allow(null);

const crearImpresoraSchema = Joi.object({
  serie,
  marca_id,
  modelo,
  estado,
  tipo,
  ubicacion,
  cliente_id,
  proyecto_id,
  tiene_accesorios,
  fecha_entrada,
  fecha_salida,
  fecha_entrega_final,
  empresa_id,
  proveedor_id,
  flujo,  
  origen_recoleccion,
  destino_distribucion,
});

module.exports = { crearImpresoraSchema };
