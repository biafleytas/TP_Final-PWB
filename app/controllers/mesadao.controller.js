const db = require("../models");
const Mesas = db.Mesas;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
// crea una mesa
    const mesa = {
        nombre_mesa: req.body.nombre_mesa,
        id_restaurante: req.body.id_restaurante,
        posicion: req.body.posicion,
        planta: req.body.planta,
        capacidad: req.body.capacidad,
    };
// Guardamos la mesa en la base de datos
    Mesas.create(mesa)
        .then(data => {
            console.log('La mesa fue creada');
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al crear la mesa."
            });
        });
};

exports.listarMesas = (req, res) => {
    const restaurante = req.query.id_restaurante;
    var condition = restaurante ? { id_restaurante: restaurante } : null;
    Mesas.findAll({ where: condition })
        .then(data => {
            console.log('Mostrando listado de mesas');
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener las mesas."
            });
        });
};

exports.eliminarMesa = (req, res) => {
    const id = req.params.id;
    var condition = id ? { id_mesa:  id } : null;
    Mesas.destroy({ where: condition }).then(res.send("La mesa fue eliminada"));
    console.log('La mesa fue eliminada');
};

exports.modificarMesa = (req, res) => {
    const id = req.params.id;
    const mesa = {
        nombre_mesa: req.body.nombre_mesa,
        id_restaurante: req.body.id_restaurante,
        posicion: req.body.posicion,
        planta: req.body.planta,
        capacidad: req.body.capacidad,
    };
    Mesas.findByPk(id)
        .then(data => {
            data.update(mesa);
            data.save().then(res.send("La mesa fue actualizada"))
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al modificar la mesa con id=" + id
            });
        });
};
