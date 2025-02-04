const { models } = require('../config/db');

class ProyectoService {
    async obtenerProyectos() {
        return await models.Proyecto.findAll();
    }

    async crearProyecto(data) {
        return await models.Proyecto.create(data);
    }
}

module.exports = new ProyectoService();
