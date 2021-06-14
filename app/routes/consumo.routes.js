module.exports = app => {
    const consumo = require("../controllers/consumodao.controller.js");
    var router = require("express").Router();

    router.get("/listado", consumo.listadoRestaurantes);
    router.get("/listarMesas", consumo.listarMesas);


    router.get("/consumoMesa", consumo.verificarConsumo);
    router.get("/agregarDetalle", consumo.crearDetalle);
    router.get("/cerrarMesa", consumo.cerrarConsumo);

    //router.get("/registroCliente/:id", reserva.verificarCliente);
   // router.get("/add", reserva.create);
    //router.post("/addCliente", reserva.crearCliente);

    router.get("/cliente", consumo.cliente);
    router.post("/addCliente", consumo.crearCliente);

    app.use('/api/consumo', router);
};