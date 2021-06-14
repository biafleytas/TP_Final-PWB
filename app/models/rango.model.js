module.exports = (sequelize, Sequelize) => {
    const Rango = sequelize.define("Rango", {
        rango_horas: {
            type: Sequelize.STRING
        },
        id_rango: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        }
    });
    return Rango;
};