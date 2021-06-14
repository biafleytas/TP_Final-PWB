const db = require("../models");
const Clientes = db.Clientes;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
// Validate request
    if (!req.body.cedula) {
        res.status(400).send({
            message: "Debe proveer un numero de cedula!"
        });
        return;
    }
// crea una cliente
    const cliente = {
        cedula: req.body.cedula,
        nombre_cliente: req.body.nombre_cliente,
        apellido: req.body.apellido
    };
// Guardamos el cliente en la base de datos
    Clientes.create(cliente)
        .then(data => {
            console.log('Se creo el cliente');
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al crear el cliente."
            });
        });
};

exports.listarClientes = (req, res) => {
    const nombre = req.query.nombre;
    var condition = nombre ? { nombre_cliente: { [Op.iLike]: `%${nombre}%` } } : null;
    Clientes.findAll( { where: condition })
        .then(data => {
            console.log('Mostrando el listado de clientes');
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener los clientes."
            });
        });
};