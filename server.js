const express = require("express");
const session = require('express-session');
const path = require ('path');
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("./app/models");
db.sequelize.sync();

app.use(session({secret: 'ssshhhhh'}));

var corsOptions = {
    origin: "http://localhost:9091"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Bienvenido Node backend 2020" });
});

require("./app/routes/mesa.routes")(app);
require("./app/routes/cliente.routes")(app);
require("./app/routes/rango.routes")(app);
require("./app/routes/reserva.routes")(app);
require("./app/routes/restaurante.routes")(app);
require("./app/routes/distribucion.routes")(app);
require("./app/routes/categoria.routes")(app);
require("./app/routes/producto.routes")(app);
require("./app/routes/consumo.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 9090;

//settings agregados
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'app/views'));

app.listen(PORT, () => {
    console.log('Servidor corriendo en puerto 9090.');
});
