const { models } = require('../config/db');

class ProyectoService {
    async obtenerProyectos() {
        return await models.Proyecto.findAll({
            include: { model: models.Cliente, as: 'cliente', attributes: ['nombre']}
        });
    }

    async crearProyecto(data) {
        const { nombre, cliente_id } = data

        // Verificar si el cliente existe antes de crear el proyecto
        const clienteExiste = await models.Cliente.findByPk(cliente_id)
        if (!clienteExiste) {
            throw new Error(`El cliente con ID ${cliente_id} no existe.`);
        }

        // Buscar si el proyecto ya existe para este cliente
        let proyecto = await models.Proyecto.findOne({ 
            where: { nombre, cliente_id }
        });

        if (!proyecto) {
            proyecto = await models.Proyecto.create({ 
                nombre,
                cliente_id 
            });
            console.log("🟢 Se creó un nuevo proyecto:", nombre, "para el cliente con ID:", cliente_id);
        } else {
            console.log("🟡 Proyecto ya existía, se usará el ID:", proyecto.id);
        }

        return proyecto;
        }
}

module.exports = new ProyectoService();
