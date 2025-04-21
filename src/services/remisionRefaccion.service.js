const { models, sequelize } = require('../config/db')

class remisionRefaccionService {
  async crearRemision (data) {
    const { numero_remision, empresa_id, cliente_id, destinatario, direccion_entrega, notas, refacciones, fecha_programada, usuario_creador } = data;

    const transaction = await sequelize.transaction()

    try {
      const fecha_programada_obj = fecha_programada ? new Date(`${fecha_programada}T00:00:00Z`) : null;

      // Validar remisión
      if (!refacciones || !Array.isArray(refacciones) || refacciones.length === 0) {
        throw new Error('No se han proporcionado refacciones para la remisión.');
      }

      // Crear la remisión
      const nuevaRemision = await models.Remision.create({
        numero_remision,
        empresa_id,
        cliente_id,
        destinatario,
        direccion_entrega,
        notas,
        fecha_programada: fecha_programada_obj,
        usuario_creador
      }, { transaction })

      // Procesar cada tipo de refacción
      for (const ref of refacciones) {
        const { id, cantidad } = ref;

        // Obtener refacciones disponibles con ese id (FIFO)
        const disponibles = await models.Refaccion.findAll({
          where: {
            numero_parte: id,
            fecha_salida: null
          },
          order: [['fecha_entrada', 'ASC']],
          limit: cantidad,
          transaction
        })

        if (disponibles.length < cantidad) {
          throw new Error(`No hay suficientes refacciones disponibles con número de parte ${id}`);
        }

        // Actualizar cada una y guardar la relacion
        for (const item of disponibles) {
          await item.update({
            fecha_salida: fecha_programada_obj,
            ubicacion: 'En Tránsito',
            cliente_id: item.tipo === 'Compra' ? cliente_id : item.cliente_id,
            proyecto_id: item.tipo === 'Compra' ? null : item.proyecto_id,
            empresa_id
          }, { transaction })

          await models.RemisionRefaccion.create(
            {
              numero_remision: nuevaRemision.numero_remision,
              refaccion_id: item.id,
              cantidad: 1
            },
            { transaction }
          )
        }
      }

      await transaction.commit()
      return nuevaRemision

    } catch (error) {
      await transaction.rollback()
      throw new Error('Error al crear la remisión de refacciones: ' + error.message)
    }
   
  }

  async obtenerRemisionPorNumero(numero_remision) {
    try {
      const remision = await models.Remision.findOne({
        where: { numero_remision },
        include: [
          { model: models.Cliente, as: "cliente" },
          { model: models.Proyecto, as: "proyecto" },
          { model: models.Empresa, as: "empresa" },
          {
            model: models.Refaccion,
            as: 'refacciones',
            through: { attributes: ['cantidad'] },
            include: [
              { model: models.Marca, as: 'marca' },
            ]
          }
        ]
      });
  
      if (!remision) {
        throw new Error("No se encontró la remisión.");
      }
  
      return remision;
    } catch (error) {
      console.error("❌ Error al obtener la remisión:", error.message);
      throw new Error("Error al obtener la remisión.");
    }
  }
  
  
  
}

module.exports = new remisionRefaccionService()