module.exports = app => {
    const mesa = require("../controllers/mesadao.controller.js");
    var router = require("express").Router();
    router.post("/", mesa.create);
    router.get("/", mesa.listarMesas);
    router.put("/:id", mesa.modificarMesa);
    router.delete("/:id", mesa.eliminarMesa);
    app.use('/api/mesa', router);
};