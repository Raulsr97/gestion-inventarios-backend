const { models } = require('../config/db');

class AccesorioService {
    async obtenerAccesorios() {
        return await models.Accesorio.findAll();
    }

    async obtenerPorId(id) {
        const accesorio = await models.Accesorio.findByPk(id)
        if (!accesorio) throw new error('Accesorio no encontardo')
        return accesorio    
    }

    async crearAccesorio(data) {
        const accesorioExistente = await models.Accesorio.findOne({ where: {numero_parte: data.numero_parte}})

        if(accesorioExistente) {
            accesorioExistente.cantidad += data.cantidad
            await accesorioExistente.save()
            return accesorioExistente
        }

        // Si no existe lo creamos
        return await models.Accesorio.create(data)
    }

    async actualizarAccesorio(id, data) {
        const accesorio = await this.obtenerPorId(id)

        return await accesorio.update(data)
    }

    async eliminarAccesorio(id) {
        const accesorio = await this.obtenerPorId(id)
        await accesorio.destroy()
        return { mensaje: 'Accesorio eliminado correctamente' }
    }
}

module.exports = AccesorioService;