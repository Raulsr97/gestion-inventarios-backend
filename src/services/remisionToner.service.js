const { models, sequelize } = require('../config/db')

class RemisionTonerService {
    async crearRemision(data) {
        const { numero_remision, empresa_id, cliente_id, proyecto_id, destinatario, direccion_entrega, notas, series, fecha_programada, usuario_creador } = data;

        // Iniciamos una transaccion para asegurar consistencia en la base de datos
        const transaction = await sequelize.transaction()

        try {
          const fecha_programada_obj = fecha_programada ? new Date(`${fecha_programada}T00:00:00Z`) : null

          // Validar que todas las series existen en la base de datos
          const tonersExistentes = await models.Toner.findAll({
            where: { serie: series },
            transaction
          })

          if (tonersExistentes.length !== series.length ) {
            throw new Error('Algunas series no existen en la base de datos')
          }

          console.log("📥 Datos recibidos en el backend:", {
            numero_remision,
            empresa_id,
            cliente_id,
            proyecto_id,
            destinatario,
            direccion_entrega,
            notas: notas || null,
            fecha_programada,
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
            fecha_programada: fecha_programada_obj,
            usuario_creador
          }, { transaction })

          // Asociar los toners a la remisión y cambiar su ubicación a 'En tránsito'
          await Promise.all(series.map(async (serie) => {
            await models.RemisionToner.create({
              numero_remision,
              serie
            }, { transaction })

            // Actualizar la ubicación de la impresora 
            await models.Toner.update(
              { 
                ubicacion: 'En Tránsito',
                fecha_salida: fecha_programada_obj,
                empresa_id
              },
              { where: { serie }, transaction }
            )
          }))

          // 🔹 Actualizar cliente_id y proyecto_id en los toners que no lo tengan
          await models.Toner.update(
            { 
                cliente_id: cliente_id, 
                proyecto_id: proyecto_id ,
                empresa_id
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

        // Obtener las toners asociadas a la remisión
        const tonersAsociados = await models.RemisionToner.findAll({
          where: { numero_remision },
          transaction
        })

        //Restaurar los toners a 'Almacen'
        await Promise.all(tonersAsociados.map(async (t) => {
          const toner = await models.Toner.findByPk(t.serie, { transaction })

          await toner.update(
            { 
              ubicacion: 'Almacen', 
              fecha_salida: null,
              empresa_id: null,
              cliente_id: toner.tipo === 'Compra' ? null : toner.cliente_id
            },
            { where: { serie: toner.serie }, transaction}
          )
        }))

        // Eliminar la relacion de la remision con las impresoras
        await models.RemisionToner.destroy( { where: { numero_remision }, transaction})

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
        const tonersAsociados = await models.RemisionToner.findAll({
          where: { numero_remision },
          transaction
        })

        // Actualizar la ubicación a entregado
        await Promise.all(tonersAsociados.map(async (toner) => {
          await models.Toner.update(
            { 
              ubicacion: 'Entregado',
              fecha_entrega_final: new Date()
            },
            { where: { serie: toner.serie}, transaction}
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
            model: models.Toner,
            as: 'toners',
            attributes: ['serie', 'modelo', 'estado', 'ubicacion']
          }
        ],
        order: [['fecha_emision', 'DESC']]
      });

      return remisiones;
    }

    async obtenerTodasRemisiones() {
      try {
        const remisiones = await models.Remision.findAll({
          include: [
            { model: models.Cliente, as: 'cliente', attributes: ['id', 'nombre']},
            { model: models.Proyecto, as: 'proyecto', attributes: ['id', 'nombre']}
          ],
          order: [['fecha_emision', 'DESC']]
        })

        return remisiones
      } catch (error) {
        console.error("❌ Error al obtener las remisiones:", error);
        throw new Error("Error al obtener las remisiones");
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
                  model: models.Toner,
                  as: 'toners',
                  through: { attributes: [] },
                  include: [
                    { model: models.Marca, as: 'marca'},
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

        const tonersAsociados = await models.RemisionToner.findAll({
          where: { numero_remision },
          transaction
        })
        
        // Actualizar cada impresora: ubicacion y fecha_entrega_final
        await Promise.all(
          tonersAsociados.map(async (toner) => {
            await models.Toner.update(
              {
                ubicacion: 'Entregado',
                fecha_entrega_final: new Date()
              },
              {
                where: { serie: toner.serie },
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

module.exports = new RemisionTonerService();

