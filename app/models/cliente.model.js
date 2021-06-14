module.exports = (sequelize, Sequelize) => {
    const Cliente = sequelize.define("Cliente", {
        nombre_cliente: {
            type: Sequelize.STRING
        },
        apellido: {
            type: Sequelize.STRING
        },
        cedula: {
            type: Sequelize.STRING,
            unique: true
        },
        id_cliente: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        }
    },
    {
       timestamps: false,
    });
    return Cliente;
};