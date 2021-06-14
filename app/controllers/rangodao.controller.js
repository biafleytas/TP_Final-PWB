const db = require("../models");
const Rangos = db.Rangos;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
// Validate request
    if (!req.body.rango_horas) {
        res.status(400).send({
            message: "Debe definir un rango!"
        });
        return;
    }
// crea una rango
    const rango = {
        rango_horas: req.body.rango_horas
    };
// Guardamos el rango definido en la base de datos
    Rangos.create(rango)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al crear el rango"
            });
        });
};

exports.listarRangos = (req, res) => {
    Rangos.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener los rangos."
            });
        });
};