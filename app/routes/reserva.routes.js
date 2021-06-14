module.exports = app => {
    const reserva = require("../controllers/reservadao.controller.js");
    var router = require("express").Router();

    router.get("/listado", reserva.prelistarReservas);
    router.get("/", reserva.listarReservas);

    router.get("/listarMesas", reserva.prelistarMesas);
    router.get("/reservar", reserva.listarMesas);

    router.get("/registroCliente/:id", reserva.verificarCliente);
    router.get("/add", reserva.create);
    router.post("/addCliente", reserva.crearCliente);

    app.use('/api/reserva', router);
};