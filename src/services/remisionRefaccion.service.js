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

  async cancelarRemision(numero_remision, usuario_cancelacion) {
    const transaction = await sequelize.transaction()

    try {
      const remision = await models.Remision.findByPk(numero_remision, { transaction })

      if (!remision) {
        throw new Error('La remision no existe')
      }

      // Solo permitimos cancelar remisiones en estado 'Pendiente'
      if (remision.estado != 'Pendiente') {
        throw new Error('Solo se pueden cancelar remisiones en estado Pendiente')
      }

      // Obtener las refacciones asociadas a la remisión
      const refaccionesAsociadas = await models.RemisionRefaccion.findAll({
        where: { numero_remision },
        transaction
      })

      //Restaurar las refacciones a 'Almacen'
      await Promise.all(refaccionesAsociadas.map(async (r) => {
        const refaccion = await models.Refaccion.findByPk(r.refaccion_id, { transaction })

        await refaccion.update(
          { 
            ubicacion: 'Almacen',        
            fecha_salida: null,
            empresa_id: null,
            cliente_id: refaccion.tipo === 'Compra' ? null : refaccion.cliente_id
          },
          { where: { id: refaccion.refaccion_id }, transaction}
        )
      }))

      // Eliminar la relacion de la remision con las impresoras
      await models.RemisionRefaccion.destroy( { where: { numero_remision }, transaction})

      // Actualizar la remision a estado 'Cancelada'
      await remision.update(
        {
          estado: 'Cancelada',
          cancelada_por: usuario_cancelacion,
          fecha_cancelacion: new Date() 
        },
        { transaction }
      )

      // Confirmar la transacción si todo salió bien
      await transaction.commit();
      return { mensaje: 'Remisión cancelada con éxito' };

  } catch (error) {
      // Si algo falla, revertimos los cambios
      await transaction.rollback();
      throw new Error('Error al cancelar la remisión: ' + error.message);
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
  
  async confirmarEntregaRemision(numero_remision, usuario_entrega, remision_firmada) {
    const transaction = await sequelize.transaction()

    try {
      const remision = await models.Remision.findByPk(numero_remision, { transaction })

      if(!remision) {
        throw new Error('La remision no existe')
      }

      // Solo se pueden confirmar remisiones en estado "Pendiente"
      if (remision.estado !== 'Pendiente') {
        throw new Error('Solo se pueden confirmar remisiones en estado Pendiente');
      }

      if (!remision_firmada) {
        throw new Error('Se requiere el archivo de remisión firmada para confirmar.');
      }

      // Obtener las impresoras asociadas a la remision
      const refaccionesAsociadasAsociados = await models.RemisionRefaccion.findAll({
        where: { numero_remision },
        transaction
      })

      // Actualizar la ubicación a entregado
      await Promise.all(refaccionesAsociadasAsociados.map(async (refaccion) => {
        await models.Refaccion.update(
          { 
            ubicacion: 'Entregado',
            fecha_entrega_final: new Date()
          },
          { where: { id: refaccion.refaccion_id}, transaction}
        )
      }))

      // Actualizar la remisión a estado "Confirmada"
      await remision.update(
        {
          estado: 'Confirmada',
          usuario_entrega,
          fecha_entrega: new Date(),
          remision_firmada
        },
        { transaction }
      )

      // Confirmar la transacción si todo salió bien
      await transaction.commit();
      return { mensaje: 'Entrega confirmada con éxito' };
    
    } catch (error) {
       // Si algo falla, revertimos los cambios
      await transaction.rollback();
      throw new Error('Error al confirmar la entrega: ' + error.message);
    }

  }

  async subirEvidencia(numero_remision, nombreArchivo) {
        const transaction = await sequelize.transaction()
  
        try {
          const remision = await models.Remision.findOne({
            where: { numero_remision },
            transaction
          })
  
          if (!remision) {
            throw new Error('Remision no encontrada')
          }
  
          const refaccionesAsociadas = await models.RemisionRefaccion.findAll({
            where: { numero_remision },
            transaction
          })
          
          // Actualizar cada impresora: ubicacion y fecha_entrega_final
          await Promise.all(
            refaccionesAsociadas.map(async (refaccion) => {
              await models.Refaccion.update(
                {
                  ubicacion: 'Entregado',
                  fecha_entrega_final: new Date()
                },
                {
                  where: { id: refaccion.refaccion_id },
                  transaction
                }
              )
            })
          )
  
          // Actualizar la remision con el archivo y estado confirmado
          remision.remision_firmada = nombreArchivo
          remision.estado = 'Confirmada'
          remision.fecha_entrega = new Date()
          remision.usuario_entrega = 'admin'
  
          await remision.save()
          await transaction.commit()
  
          return remision
        } catch (error) {
          await transaction.rollback()
          console.error("❌ Error al subir evidencia:", error.message)
          throw new Error("No se pudo actualizar la remisión con la evidencia")
        }
  }

  async modificarFechaProgramada(numero_remision, nuevaFecha) {
      try {
        const remision = await models.Remision.findByPk(numero_remision)

        if (!remision) {
          throw new Error('La remision no existe')
        }

        if(remision.estado !== 'Pendiente') {
          throw new Error("Solo se puede modificar la fecha de una remisión pendiente");
        }

        const nuevaFechaObj = new Date(`${nuevaFecha}T00:00:00Z`)
        remision.fecha_programada = nuevaFechaObj

        await remision.save()

        return {
          mensaje:"Fecha programada actualizada correctamente",
          remision 
        }
      } catch (error) {
        console.error("❌ Error al modificar fecha programada:", error.message);
        throw new Error("No se pudo actualizar la fecha programada");
      }
  }
  
}

module.exports = new remisionRefaccionService()