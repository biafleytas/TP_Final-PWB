module.exports = app => {
    const distribucion = require("../controllers/distribuciondao.controller.js");
    var router = require("express").Router();
    router.get("/", distribucion.distribucionMesas);
    app.use('/api/distribucion', router);
};