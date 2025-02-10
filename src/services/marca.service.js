const { models } = require('../config/db')

class MarcaService {
    async obtenerMarcas() {
        return await models.Marca.findAll();
    }

    async crearMarca(data) {
        return await models.Marca.create(data);
    }
}

module.exports = new MarcaService();
