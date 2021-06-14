module.exports = (sequelize, Sequelize) => {
    const Restaurante = sequelize.define("Restaurante", {
        nombre_restaurante: {
            type: Sequelize.STRING
        },
        direccion: {
            type: Sequelize.STRING
        },
        id_restaurante: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        }
    },
    {
        timestamps: false,
    });
    return Restaurante;
};