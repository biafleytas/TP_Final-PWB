const db = require("../models");
const Restaurantes = db.Restaurantes;
const Mesas = db.Mesas;
const Op = db.Sequelize.Op;

Mesas.belongsTo(Restaurantes, { as: 'mesas1', foreignKey: 'id_restaurante' });
Restaurantes.hasMany(Mesas, { as: 'mesaRestaurante', foreignKey: 'id_restaurante' });

exports.create = (req, res) => {
// crea un restaurante
    const restaurante = {
        nombre_restaurante: req.body.nombre_restaurante,
        direccion: req.body.direccion,
    };
// Guardamos el restaurante en la base de datos
    Restaurantes.create(restaurante)
        .then(data => {
            console.log('El restaurante fue creado');
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al crear el restaurante."
            });
        });
};

exports.listarRestaurantes = (req, res) => {
    Restaurantes.findAll({
        include: [
            { model: Mesas, as: "mesaRestaurante" },
        ]
    })
        .then(data => {
            console.log('Mostrando listado de restaurantes');
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener los restaurantes."
            });
        });
};

exports.eliminarRestaurante = (req, res) => {
    const id = req.params.id;
    var condition = id ? { id_restaurante:  id } : null;
    Restaurantes.destroy({ where: condition }).then(res.send("El restaurante fue eliminado"));
};

exports.modificarRestaurante = (req, res) => {
    const id = req.params.id;
    const restaurante = {
        nombre_restaurante: req.body.nombre_restaurante,
        direccion: req.body.direccion,
    };
    Restaurantes.findByPk(id)
        .then(data => {
            data.update(restaurante);
            data.save().then(res.send("El restaurante fue actualizado"))
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al modificar el restaurante con id=" + id
            });
        });
};