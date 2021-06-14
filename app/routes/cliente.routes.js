module.exports = app => {
    const cliente = require("../controllers/clientedao.controller.js");
    var router = require("express").Router();
    router.post("/", cliente.create);
    router.get("/", cliente.listarClientes);
    app.use('/api/cliente', router);
};