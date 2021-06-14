const db = require("../models");
const Productos = db.Productos;
const Op = db.Sequelize.Op;
exports.create = (req, res) => {
// crea un producto
    const producto = {
        nombre_producto: req.body.nombre_producto,
        id_categoria: req.body.id_categoria,
        precio: req.body.precio,
    };
// Guardamos el producto en la base de datos
    Productos.create(producto)
        .then(data => {
            console.log('El producto fue creado');
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al crear el producto."
            });
        });
};

exports.listarProductos = (req, res) => {
    const categoria = req.query.id_categoria;
    var condition = categoria ? { id_categoria: categoria } : null;
    Productos.findAll({ where: condition })
        .then(data => {
            console.log('Mostrando listado de productos');
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener los productos."
            });
        });
};

exports.eliminarProducto = (req, res) => {
    const id = req.params.id;
    var condition = id ? { id_producto:  id } : null;
    Productos.destroy({ where: condition }).then(res.send("El producto fue eliminado"));
    console.log('El producto fue eliminado');
};

exports.modificarProducto = (req, res) => {
    const id = req.params.id;
    const producto = {
        nombre_producto: req.body.nombre_producto,
        id_categoria: req.body.id_categoria,
        precio: req.body.precio,
    };
    Productos.findByPk(id)
        .then(data => {
            data.update(producto);
            data.save().then(res.send("El producto fue modificado"))
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al modificar el producto con id=" + id
            });
        });
};
