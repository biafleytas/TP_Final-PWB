module.exports = (sequelize, Sequelize) => {
    const Mesa = sequelize.define("Mesa", {
        nombre_mesa: {
            type: Sequelize.STRING
        },
        id_restaurante: {
            type: Sequelize.BIGINT,
            references: {
                model: 'Restaurantes',
                key: 'id_restaurante',
            },
        },
        posicion: {
            type: Sequelize.STRING
        },
        planta: {
            type: Sequelize.BIGINT
        },
        capacidad: {
            type: Sequelize.BIGINT
        },
        id_mesa: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        }
    },
    {
        timestamps: false,
    });
    return Mesa;
};