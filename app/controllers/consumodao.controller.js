const db = require("../models");
const Consumos = db.Consumos;
const Detalles = db.Detalles;
const Restaurantes = db.Restaurantes;
const Mesas = db.Mesas;
const Clientes = db.Clientes;
const Productos = db.Productos;
const Op = db.Sequelize.Op;

Consumos.hasMany(Detalles, { as: 'consumos', foreignKey: 'id_consumo' });
Detalles.belongsTo(Consumos, { as: 'detalleConsumo', foreignKey: 'id_consumo' });

Productos.hasMany(Detalles, { as: 'productos', foreignKey: 'id_producto' });
Detalles.belongsTo(Productos, { as: 'detalleProducto', foreignKey: 'id_producto' });

//pagina que muestra seleccion de datos para listado de mesas libres
exports.listadoRestaurantes = (req, res) => {
    //Select de los restaurantes para mostrar en mi lista
    Restaurantes.findAll({
        order: [
            ['nombre_restaurante', 'ASC'],
        ]
    })
        .then(dataRes => {
            res.render('consumoRestaurantes',{data: dataRes});
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener los restaurantes."
            });

        });
};


//pagina que muestra el listado de mesas segun selecciones hechas en listadoRestaurantes
exports.listarMesas = (req, res) => {
    var sess = req.session;
    sess.restauranteId =  req.query.id_restaurante;
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
    Mesas.findAll({
        where: {
            id_restaurante: req.query.id_restaurante,
        },
        order: [
            ['nombre_mesa', 'ASC'],
        ]
    })
        .then(data => {
            console.log('Mostrando el listado de mesas');
            res.render('consumoMesas',{data: data, dataRes, sess});
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener el listado de mesas."
            });
        });
};


//verifico si la mesa ya tiene consumo
exports.verificarConsumo = (req, res) => {
    var sess = req.session;
    sess.mesaID = req.query.id_mesa;
    var cliente;
    var producto;
    //listado de clientes
    Clientes.findAll()
        .then(datoCliente => {
            cliente=datoCliente;
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener los clientes."
            });
        });
    //listado de productos
    Productos.findAll()
        .then(datoProducto => {
            producto = datoProducto;
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener los productos."
            });
        });
    //verifica si el consumo de esa mesa ya esta abierto
    Consumos.findAll({
        where: {
            id_mesa: sess.mesaID,
            estado: "abierto"
        },
    })
        .then(consumo => {
            //si ya esta abierto, guardo los datos de la cabecera para desplegarla en mi vista y busco sus detalles
            if (consumo.length==1)
            {
                console.log('La mesa esta abierta');
                sess.cabeceraID = consumo[0].dataValues.id_consumo;
                sess.clienteID = consumo[0].dataValues.id_cliente;
                Detalles.findAll({
                    where: {
                        id_consumo: sess.cabeceraID,
                    },
                    include: [
                        { model: Productos, as: "detalleProducto"}
                    ]
                })
                    .then(data => {
                        console.log('Mostrando el listado de detalles');
                        res.render('listadoConsumo',{data: data, producto, cliente, sess});
                    })
                    .catch(err => {
                        res.status(500).send({
                            message:
                                err.message || "Ocurrio un error al obtener el listado de detalles."
                        });
                    });
            }else{
                console.log('La mesa esta libre');
                //obtengo la fecha y hora actual
                var fecha = new Date(); //Fecha actual
                var mes = fecha.getMonth()+1; //obteniendo mes
                var dia = fecha.getDate(); //obteniendo dia
                var ano = fecha.getFullYear(); //obteniendo año
                if(dia<10)
                    dia='0'+dia; //agrega cero si el menor de 10
                if(mes<10)
                    mes='0'+mes //agrega cero si el menor de 10
                const detalle = {
                    id_mesa: sess.mesaID,
                    estado: "abierto",
                    total: 0,
                    fechaCreacion: fecha
                };
                Consumos.create(detalle)
                    .then(detalle => {
                        console.log('Se guardo la cabecera');
                        sess.cabeceraID = detalle.id_consumo;
                        res.render('listadoConsumo',{data: consumo, producto, cliente, sess});
                    })
                    .catch(err => {
                        res.status(500).send({
                            message:
                                err.message || "Ha ocurrido un error al crear la cabecera."
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener el consumo."
            });
        });
};

//creo un detalle
exports.crearDetalle = (req, res) => {
    var sess=req.session;
    sess.clienteID = req.query.id_cliente;
    //busco en la bd si ya hay un detalle con ese producto para ese consumo
    Detalles.findAll({
        where: {
            id_consumo: sess.cabeceraID,
            id_producto: req.query.id_producto,
        }
    })
        .then(detalleProducto => {
            if (detalleProducto.length==0) //el detalle no existe aun, creo uno nuevo
            {
                //crea un detalle
                const detalle = {
                    id_producto: req.query.id_producto,
                    id_consumo: sess.cabeceraID,
                    cantidad: req.query.cantidad
                };
                // Guardamos el detalle en la base de datos
                Detalles.create(detalle)
                    .then(detalles => {
                        console.log('Se guardo el detalle');
                        //listado de clientes
                        Clientes.findAll()
                            .then(datoCliente => {
                                cliente=datoCliente;
                            })
                            .catch(err => {
                                res.status(500).send({
                                    message:
                                        err.message || "Ocurrio un error al obtener los clientes."
                                });
                            });
                        //listado de productos
                        Productos.findAll()
                            .then(datoProducto => {
                                producto = datoProducto;
                            })
                            .catch(err => {
                                res.status(500).send({
                                    message:
                                        err.message || "Ocurrio un error al obtener los productos."
                                });
                            });
                        //listado de detalles
                        Detalles.findAll({
                            where: {
                                id_consumo: sess.cabeceraID,
                            },
                            include: [
                                { model: Productos, as: "detalleProducto"}
                            ]
                        })
                            .then(dataDetalle => {
                                console.log('Mostrando el listado de detalles');
                                //pongo el id del cliente en mi cabecera
                                const consumo = {
                                    id_cliente: sess.clienteID,
                                };
                                Consumos.findByPk(sess.cabeceraID)
                                    .then(data => {
                                        data.update(consumo);
                                        data.save().then(res.render('listadoConsumo',{data: dataDetalle, producto, cliente, sess}))
                                    })
                                    .catch(err => {
                                        res.status(500).send({
                                            message: "Error al modificar la cabecera con id=" + sess.cabeceraID
                                        });
                                    });
                            })
                            .catch(err => {
                                res.status(500).send({
                                    message:
                                        err.message || "Ocurrio un error al obtener el listado de detalles."
                                });
                            });
                    })
                    .catch(err => {
                        res.status(500).send({
                            message:
                                err.message || "Ha ocurrido un error al crear el detalle."
                        });
                    });
            }else ////el detalle ya existe, modifico la cantidad
            {
                var cantidad = parseInt(req.query.cantidad) + parseInt(detalleProducto[0].dataValues.cantidad);
                //crea un detalle
                const detalle = {
                    cantidad: cantidad
                };
                //Modificamos el detalle en la base de datos
                detalleProducto[0].update(detalle);
                detalleProducto[0].save()
                    .then(e =>{
                        //listado de clientes
                        Clientes.findAll()
                            .then(datoCliente => {
                                cliente=datoCliente;
                            })
                            .catch(err => {
                                res.status(500).send({
                                    message:
                                        err.message || "Ocurrio un error al obtener los clientes."
                                });
                            });
                        //listado de productos
                        Productos.findAll()
                            .then(datoProducto => {
                                producto = datoProducto;
                            })
                            .catch(err => {
                                res.status(500).send({
                                    message:
                                        err.message || "Ocurrio un error al obtener los productos."
                                });
                            });
                        //listado de detalles
                        Detalles.findAll({
                            where: {
                                id_consumo: sess.cabeceraID,
                            },
                            include: [
                                { model: Productos, as: "detalleProducto"}
                            ]
                        })
                            .then(dataDetalle => {
                                console.log('Mostrando el listado de detalles');
                                //pongo el id del cliente en mi cabecera
                                const consumo = {
                                    id_cliente: sess.clienteID,
                                };
                                Consumos.findByPk(sess.cabeceraID)
                                    .then(data => {
                                        data.update(consumo);
                                        data.save().then(res.render('listadoConsumo',{data: dataDetalle, producto, cliente, sess}))
                                    })
                                    .catch(err => {
                                        res.status(500).send({
                                            message: "Error al modificar la cabecera con id=" + sess.cabeceraID
                                        });
                                    });
                            })
                            .catch(err => {
                                res.status(500).send({
                                    message:
                                        err.message || "Ocurrio un error al obtener el listado de detalles."
                                });
                            });
                    })
                    .catch(err => {
                        res.status(500).send({
                            message:
                                err.message || "Ocurrio un error al guardar el detalle."
                        });
                    });
                //res.render('listadoConsumo',{data: dataDetalle, producto, cliente, sess}));


            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener el listado de detalles."
            });
        });
};


//cerrar el consumo de la mesa
exports.cerrarConsumo = (req, res) => {
    var sess=req.session;
    const id = sess.cabeceraID;
    //obtengo la fecha y hora actual
    var fecha = new Date(); //Fecha actual
    var mes = fecha.getMonth()+1; //obteniendo mes
    var dia = fecha.getDate(); //obteniendo dia
    var ano = fecha.getFullYear(); //obteniendo año
    if(dia<10)
        dia='0'+dia; //agrega cero si el menor de 10
    if(mes<10)
        mes='0'+mes //agrega cero si el menor de 10
    const consumo = {
        estado: "cerrado",
        total: req.query.total_consumo,
        fechaCierre: fecha,
        id_cliente: sess.clienteID,
    };
    Consumos.findByPk(id)
        .then(data => {
            Clientes.findByPk(sess.clienteID)
                .then(dataCliente => {
                    cliente = dataCliente.dataValues.nombre_cliente;
                    apellido = dataCliente.dataValues.apellido;
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error al encontrar el cliente con id=" + sess.clienteID
                });
            });
            Detalles.findAll({
                where: {
                    id_consumo: sess.cabeceraID,
                },
                include: [
                    { model: Productos, as: "detalleProducto"}
                ]
            }).then(dataDetalle => {
                detalle = dataDetalle;
            })
                .catch(err => {
                    res.status(500).send({
                        message: "Error al encontrar los detalles con consumo id=" + sess.cabeceraID
                    });
                });
            data.update(consumo);
            data.save().then( _ => {
                //generando el pdf
                const PDFDocument = require('pdfkit');
                let pdfDoc = new PDFDocument;
                pdfDoc.pipe(res);
                pdfDoc.text("TICKET");
                pdfDoc.text("Cliente: "+ cliente + " " + apellido);
                for (var i=0; i<detalle.length; i++)
                {
                    pdfDoc.text("Producto: "+ detalle[i].dataValues.detalleProducto.dataValues.nombre_producto+"     Cantidad: "+ detalle[i].dataValues.cantidad);
                }
                pdfDoc.text("Fecha: "+ fecha.toISOString().slice(0, 10) + " " +fecha.toISOString().slice(11,19));
                pdfDoc.text("Total: "+ req.query.total_consumo);
                pdfDoc.end();
                console.log('Imprimiendo pdf');
            })
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al encontrar el consumo con id=" + id
            });
        });
};

//voy al formulario de cliente
exports.cliente = (req, res) => {
    res.render('formConsumoCliente');
};
//creo un cliente con los datos cargados en el formulario
exports.crearCliente = (req, res) => {
    var sess=req.session;
    // crea un cliente
    const clientedato = {
        cedula: req.body.cedula,
        nombre_cliente: req.body.nombre_cliente,
        apellido: req.body.apellido
    };
    // Guardamos el cliente en la base de datos
    Clientes.create(clientedato)
        .then(clientedato => {
            console.log('Se guardo el cliente');
            sess.clienteID = clientedato.id_cliente;
            var cliente;
            var producto;
            //listado de clientes
            Clientes.findAll()
                .then(datoCliente => {
                    cliente=datoCliente;
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Ocurrio un error al obtener los clientes."
                    });
                });
            //listado de productos
            Productos.findAll()
                .then(datoProducto => {
                    producto = datoProducto;
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Ocurrio un error al obtener los productos."
                    });
                });
            Detalles.findAll({
                where: {
                    id_consumo: sess.cabeceraID,
                },
                include: [
                    { model: Productos, as: "detalleProducto"}
                ]
            })
                .then(data => {
                    console.log('Mostrando el listado de detalles');
                    res.render('listadoConsumo',{data: data, producto, cliente, sess});
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Ocurrio un error al obtener el listado de detalles."
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al crear el cliente."
            });
        });
};