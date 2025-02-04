const { models } = require('../config/db');

class RefaccionService {
    async obtenerRefacciones() {
        return await models.Refaccion.findAll();
    }

    async crearRefaccion(data) {
        return await models.Refaccion.create(data);
    }
}

module.exports = new RefaccionService();
