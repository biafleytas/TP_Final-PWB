module.exports = (sequelize, Sequelize) => {
    const Consumo = sequelize.define("Consumo", {
            id_mesa: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'Mesas',
                    key: 'id_mesa',
                }
            },
            id_cliente: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'Clientes',
                    key: 'id_cliente',
                },
            },
            estado: {
                type: Sequelize.STRING
            },
            total: {
                type: Sequelize.BIGINT
            },
            fechaCreacion: {
                type: Sequelize.DATE,
            },
            fechaCierre: {
                type: Sequelize.DATE,
            },
            id_consumo: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            }
        },
        {
            timestamps: false,
        });
    return Consumo;
};