module.exports = app => {
    const categoria = require("../controllers/categoriadao.controller.js");
    var router = require("express").Router();
    router.post("/", categoria.create);
    router.get("/", categoria.listarCategorias);
    router.put("/:id", categoria.modificarCategoria);
    router.delete("/:id", categoria.eliminarCategoria);
    app.use('/api/categoria', router);
};