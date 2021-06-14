const db = require("../models");
const Mesas = db.Mesas;
const Reservas = db.Reservas;


//pagina que muestra seleccion de datos para listado de reservas por rango, fecha y cliente
exports.distribucionMesas = (req, res) => {
    var mesasReservadas=null;
    Reservas.findAll({
        where: {
            id_restaurante: req.query.restaurante,
            fecha: req.query.fecha,
            id_rango: req.query.rango
        },
        order: [
            ['id_mesa', 'ASC'],
        ]
    })
        .then(dataReservaMesa => {
            mesasReservadas = dataReservaMesa;
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener las reservas."
            });
        });
    Mesas.findAll({
        where: {
            id_restaurante: req.query.restaurante,
            planta: req.query.planta
        },
    })
        .then(data => {
            res.render('distribucion',{data: data, mesasReservadas});
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener los restaurantes."
            });
        });

};