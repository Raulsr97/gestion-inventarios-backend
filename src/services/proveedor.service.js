const { models } = require('../config/db')

class ProveedorService {
    async obtenerProveedores() {
        return await models.Proveedor.findAll();
    }

    async crearProveedor(data) {
        return await models.Proveedor.create(data);
    }
}

module.exports = new ProveedorService();
