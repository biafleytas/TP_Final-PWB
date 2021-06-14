module.exports = (sequelize, Sequelize) => {
    const Reserva = sequelize.define("Reserva", {
        id_restaurante: {
            type: Sequelize.BIGINT,
            references: {
                model: 'Restaurantes',
                key: 'id_restaurante',
            }
        },
        id_mesa: {
            type: Sequelize.BIGINT,
            references: {
                model: 'Mesas',
                key: 'id_mesa',
            }
        },
        fecha: {
            type: Sequelize.DATEONLY,
        },
        id_rango: {
            type: Sequelize.BIGINT,
            references: {
                model: 'Rangos',
                key: 'id_rango',
            }
        },
        id_cliente: {
            type: Sequelize.BIGINT,
            references: {
                model: 'Clientes',
                key: 'id_cliente',
            },
        },
        cantidad_solicitada: {
            type: Sequelize.BIGINT
        },
        id_reserva: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },

    },
    {
        timestamps: false,
    });
    return Reserva;
};