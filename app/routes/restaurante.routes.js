module.exports = app => {
    const restaurante = require("../controllers/restaurantedao.controller.js");
    var router = require("express").Router();
    router.post("/", restaurante.create);
    router.get("/", restaurante.listarRestaurantes);
    router.put("/:id", restaurante.modificarRestaurante);
    router.delete("/:id", restaurante.eliminarRestaurante);
    app.use('/api/restaurante', router);
};