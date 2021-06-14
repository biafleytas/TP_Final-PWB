module.exports = app => {
    const rango = require("../controllers/rangodao.controller.js");
    var router = require("express").Router();
    router.post("/", rango.create);
    router.get("/", rango.listarRangos);
    app.use('/api/rango', router);
};