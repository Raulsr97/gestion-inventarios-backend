const { models } = require('../config/db');

class ImpresoraService {
    async obtenerImpresoras() {
        return await models.Impresora.findAll();
    }

    async crearImpresora(data) {
        return await models.Impresora.create(data);
    }

    async registrarLote(data) {
        const { modelo, proveedor, estado, tipo, ubicacion, cliente_id, proyecto_id, tiene_accesorios, series } = data;

        const impresoras = series.map(serie => ({
            serie,
            modelo,
            proveedor: proveedor || null,
            estado: estado || 'Nueva',
            tipo: tipo || 'Propia',
            ubicacion: ubicacion || 'Almacén',
            cliente_id: cliente_id || null,
            proyecto_id: proyecto_id || null,
            tiene_accesorios: tiene_accesorios || false,
            fecha_entrada: new Date()
        }));

        await models.Impresora.bulkCreate(impresoras);

        return {
            mensaje: "Impresoras registradas exitosamente",
            total: series.length
        };
    }
}

module.exports = new ImpresoraService();
