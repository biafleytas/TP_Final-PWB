const db = require("../models");
const Reservas = db.Reservas;
const Restaurantes = db.Restaurantes;
const Mesas = db.Mesas;
const Rangos = db.Rangos;
const Clientes = db.Clientes;
const Op = db.Sequelize.Op;

Mesas.hasMany(Reservas, { as: 'mesas', foreignKey: 'id_mesa' });
Reservas.belongsTo(Mesas, { as: 'reservaMesa', foreignKey: 'id_mesa' });

Restaurantes.hasMany(Reservas, { as: 'restaurantes', foreignKey: 'id_restaurante' });
Reservas.belongsTo(Restaurantes, { as: 'reservaRestaurante', foreignKey: 'id_restaurante' });

Clientes.hasMany(Reservas, { as: 'clientes', foreignKey: 'id_cliente' });
Reservas.belongsTo(Clientes, { as: 'reservaCliente', foreignKey: 'id_cliente' });

Rangos.hasMany(Reservas, { as: 'rangos', foreignKey: 'id_rango' });
Reservas.belongsTo(Rangos, { as: 'reservaRango', foreignKey: 'id_rango' });

//verifico si el cliente que quiere reservar ya existe, si existe, pido confirmar la reserva, si no existe, pido registrar el cliente
exports.verificarCliente = (req, res) => {
    var sess=req.session;
    sess.mesaID = req.params.id;
    sess.cantidad = req.query.cantidad;
    Clientes.findAll({where: {cedula: sess.cliente},})
        .then(cliente => {
            if (cliente.length==1)
            {
                console.log('El cliente existe');
                sess.clienteID = cliente[0].dataValues.id_cliente;
                res.render('confirmar');
            }else{
                console.log('El cliente no existe');
                res.render('formClientes');
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener el cliente."
            });
        });
};

//creo un cliente
exports.crearCliente = (req, res) => {
    var sess=req.session;
    // crea un cliente
    const cliente = {
        cedula: sess.cliente,
        nombre_cliente: req.body.nombre_cliente,
        apellido: req.body.apellido
    };
    // Guardamos el cliente en la base de datos
    Clientes.create(cliente)
        .then(cliente => {
            console.log('Se guardo el cliente');
            sess.clienteID = cliente.id_cliente;
            res.render('confirmar');
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al crear el cliente."
            });
        });
};

//creo la reserva
exports.create = (req, res) => {
    var sess=req.session;
    if (!Array.isArray(sess.rangoId))
    {
        sess.rangoId = [sess.rangoId];
    }
    // Guardamos la reserva en la base de datos
    for (var i=0; i<sess.rangoId.length; i++)
    {
        Reservas.create({
            id_restaurante: sess.restauranteId,
            id_mesa: sess.mesaID,
            fecha: sess.fecha,
            id_rango: sess.rangoId[i],
            id_cliente: sess.clienteID,
            cantidad_solicitada: sess.cantidad})
            .then(data => {
                console.log('Se guardo la reserva');
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Ha ocurrido un error al crear la reserva."
                });
            });
    }
    res.render('principal');
};

//pagina que muestra seleccion de datos para listado de reservas por rango, fecha y cliente
exports.prelistarReservas = (req, res) => {
    Restaurantes.findAll({
        order: [
            ['nombre_restaurante', 'ASC'],
        ]
    })
        .then(datosRestaurante => {
            dataRes=datosRestaurante;
            res.render('listado',{data: dataRes});
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener los restaurantes."
            });
        });
};

//pagina que muestra el listado de reservas segun selecciones hechas en preListarReservas
exports.listarReservas = (req, res) => {
    const restaurante = req.query.restaurante;
    const fecha = req.query.fecha;
    const cliente = req.query.cliente;
    var dataRes;
    var sess=req.session;
    console.log(sess);
    Restaurantes.findAll()
        .then(datosRestaurante => {
            dataRes=datosRestaurante;
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener los restaurantes."
            });
        });
    Reservas.findAll({
        where: {
            id_restaurante: restaurante,
            fecha: fecha
        },
        order: [
            ['id_rango', 'ASC'],
            ['id_mesa', 'ASC'],
        ],
        include: [
            { model: Restaurantes, as: "reservaRestaurante" },
            { model: Mesas, as: "reservaMesa" },
            { model: Clientes, as: "reservaCliente", where: cliente ? { cedula: cliente } : null },
            { model: Rangos, as: "reservaRango" }
        ]
    })
        .then(data => {
            console.log('Mostrando el listado de reservas');
            res.render('prueba',{data: data, dataRes, fecha, cliente, restaurante} );
        })
        .catch(err => {

            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener el listado de reservas."
            });
        });
};


//pagina que muestra seleccion de datos para listado de mesas libres
exports.prelistarMesas = (req, res) => {
    //Select de los restaurantes para mostrar en mi lista
    var dataRes=null;
    Restaurantes.findAll({
        order: [
            ['nombre_restaurante', 'ASC'],
        ]
    })
        .then(datosRestaurante => {
            dataRes=datosRestaurante;
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener los restaurantes."
            });
        });
    //Select de los rangos para mostrar en mi lista
    Rangos.findAll()
        .then(data => {
            res.render('mesas',{data: data, dataRes});
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener los rangos."
            });
        });
};

//pagina que muestra el listado de mesas libres segun selecciones hechas en preListarMesas
exports.listarMesas = (req, res) => {
    var sess = req.session;
    sess.restauranteId =  req.query.id_restaurante;
    sess.fecha = req.query.fecha;
    sess.rangoId = req.query.id_rango;
    console.log(sess.rangoId)
    sess.cliente = req.query.cliente;
    //Select de los restaurantes para mostrar en mi lista
    var dataRes;
    Restaurantes.findAll({
        order: [
            ['nombre_restaurante', 'ASC'],
        ]
    })
        .then(datosRestaurante => {
            dataRes=datosRestaurante;
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener los restaurantes."
            });
        });
    //Select de los rangos para mostrar en mi lista
    var dataRango;
    Rangos.findAll()
        .then(datosRangos => {
            dataRango=datosRangos;
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener los rangos."
            });
        });
    //Select para traer TODAS las mesas del restaurante elegido
    var mesasTotales=null;
    Mesas.findAll({
        where: {
            id_restaurante: req.query.id_restaurante
        },
        order: [
            ['nombre_mesa', 'ASC'],
        ]
        })
        .then(dataMesas => {
            mesasTotales=dataMesas;
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener las mesas."
            });
        });
    //Select para traer todas las reservas del restaurante en esa fecha y rango de horas
    var mesasReservadas=null;
    Reservas.findAll({
        where: {
            id_restaurante: req.query.id_restaurante,
            fecha: req.query.fecha,
            id_rango: req.query.id_rango
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
            id_restaurante: req.query.id_restaurante,
        },
        order: [
            ['nombre_mesa', 'ASC'],
        ]
    })
        .then(data => {
            console.log('Mostrando el listado de mesas no reservadas');
            res.render('reserva',{data: data, dataRes, dataRango, mesasTotales, mesasReservadas, sess});
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener el listado de mesas."
            });
        });
};