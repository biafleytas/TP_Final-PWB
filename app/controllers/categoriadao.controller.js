const db = require("../models");
const Categorias = db.Categorias;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
// crea una categoria de producto
    const categoria = {
        nombre_categoria: req.body.nombre_categoria,
    };
// Guardamos la categoria en la base de datos
    Categorias.create(categoria)
        .then(data => {
            console.log('La categoria de producto fue creada');
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ha ocurrido un error al crear la categoria."
            });
        });
};

exports.listarCategorias = (req, res) => {
    Categorias.findAll()
        .then(data => {
            console.log('Mostrando listado de categorias');
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ocurrio un error al obtener las categorias."
            });
        });
};

exports.eliminarCategoria = (req, res) => {
    const id = req.params.id;
    var condition = id ? { id_categoria:  id } : null;
    Categorias.destroy({ where: condition }).then(res.send("La categoria fue eliminada"));
    console.log('La categoria fue eliminada');
};

exports.modificarCategoria = (req, res) => {
    const id = req.params.id;
    const categoria = {
        nombre_categoria: req.body.nombre_categoria,
    };
    Categorias.findByPk(id)
        .then(data => {
            data.update(categoria);
            data.save().then(res.send("La categoria fue actualizada"))
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al modificar la categoria con id=" + id
            });
        });
};
