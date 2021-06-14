module.exports = app => {
    const producto = require("../controllers/productodao.controller.js");
    var router = require("express").Router();
    router.post("/", producto.create);
    router.get("/", producto.listarProductos);
    router.put("/:id", producto.modificarProducto);
    router.delete("/:id", producto.eliminarProducto);
    app.use('/api/producto', router);
};