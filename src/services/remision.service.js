const { models, sequelize } = require('../config/db')

class RemisionService {
    async crearRemision(data) {
        const { numero_remision, empresa_id, cliente_id, proyecto_id, destinatario, direccion_entrega, notas, series, usuario_creador } = data;

        // Iniciamos una transaccion para asegurar consistencia en la base de datos
        const transaction = await sequelize.transaction()

        try {
          // Validar que todas las series existen en la base de datos
          const impresorasExistentes = await models.Impresora.findAll({
            where: { serie: series },
            transaction
          })

          if (impresorasExistentes.length !== series.length ) {
            throw new Error('Algunas series no existen en la base de datos')
          }

          console.log("📥 Datos recibidos en el backend:", {
            numero_remision,
            empresa_id,
            cliente_id,
            proyecto_id,
            destinatario,
            direccion_entrega,
            notas,
            usuario_creador
          });

          // Crear la remision con la transaccion
          const nuevaRemision = await models.Remision.create({
            numero_remision,
            empresa_id,
            cliente_id,
            proyecto_id,
            destinatario,
            direccion_entrega,
            notas,
            usuario_creador
          }, { transaction })

          // Asociar las impresoras a la remisión y cambiar su ubicación a 'En tránsito'
          await Promise.all(series.map(async (serie) => {
            await models.RemisionImpresora.create({
              numero_remision,
              serie
            }, { transaction })

            // Actualizar la ubicación de la impresora 
            await models.Impresora.update(
              { 
                ubicacion: 'En Tránsito',
                fecha_salida: new Date()
              },
              { where: { serie }, transaction }
            )
          }))

          // 🔹 Actualizar cliente_id y proyecto_id en las impresoras que no lo tengan
          await models.Impresora.update(
            { 
                cliente_id: cliente_id, 
                proyecto_id: proyecto_id 
            },
            { 
                where: { 
                    serie: series, 
                    cliente_id: null, // Solo las que no tienen cliente asignado
                    proyecto_id:null
                },
                transaction
            }
          )

          await transaction.commit()
          return nuevaRemision

        } catch (error) {
          // Si algo falla, revertimos los cambios
          await transaction.rollback();
          throw new Error('Error al crear la remisión: ' + error.message);
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

        // Obtener las impresoras asociadas a la remisión
        const impresorasAsociadas = await models.RemisionImpresora.findAll({
          where: { numero_remision },
          transaction
        })

        //Restaurar las impresoras a 'Almacen'
        await Promise.all(impresorasAsociadas.map(async (impresora) => {
          await models.Impresora.update(
            { 
              ubicacion: 'Almacen', 
              fecha_salida: null
            },
            { where: { serie: impresora.serie }, transaction}
          )
        }))

        // Eliminar la relacion de la remision con las impresoras
        await models.RemisionImpresora.destroy( { where: { numero_remision }, transaction})

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

    async confirmarEntregaRemision(numero_remision, usuario_entrega, remision_firmada = null) {
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

        // Obtener las impresoras asociadas a la remision
        const impresorasAsociadas = await models.RemisionImpresora.findAll({
          where: { numero_remision },
          transaction
        })

        // Actualizar la ubicación a entregado
        await Promise.all(impresorasAsociadas.map(async (impresora) => {
          await models.Impresora.update(
            { 
              ubicacion: 'Entregado',
              fecha_entrega_final: new Date()
            },
            { where: { serie: impresora.serie}, transaction}
          )
        }))

        // Actualizar la remisión a estado "Confirmada"
        await remision.update(
          {
            estado: 'Confirmada',
            usuario_entrega,
            fecha_entrega: new Date(),
            remision_firmada: remision_firmada || null
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

    async buscarRemisiones(filtros = {}) {
      const { numero_remision, empresa_id, cliente_id, proyecto_id, estado} = filtros

      // Construccion de filtros dinámicos
      const whereClause = {}
      if (numero_remision) whereClause.numero_remision = numero_remision
      if (empresa_id) whereClause.empresa_id = empresa_id;
      if (cliente_id) whereClause.cliente_id = cliente_id;
      if (proyecto_id) whereClause.proyecto_id = proyecto_id;
      if (estado) whereClause.estado = estado;

      // Consultamos las remisiones en base a los filtros aplicados
      const remisiones = await models.Remision.findAll({
        where: whereClause,
        include: [
          {
            model: models.Empresa,
            as: 'empresa',
            attributes: ['id', 'nombre']
          },
          {
            model: models.Cliente,
            as: 'cliente',
            attributes: ['id', 'nombre']
          },
          {
            model: models.Proyecto,
            as: 'proyecto',
            attributes: ['id', 'nombre']
          },
          {
            model: models.Impresora,
            as: 'impresoras',
            attributes: ['serie', 'modelo', 'estado', 'ubicacion']
          }
        ],
        order: [['fecha_emision', 'DESC']]
      });

      return remisiones;
    }
}

module.exports = new RemisionService();

