module.exports = (sequelize, Sequelize) => {
    const Detalle = sequelize.define("Detalle", {
            id_producto: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'Productos',
                    key: 'id_producto',
                },
            },
            id_consumo: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'Consumos',
                    key: 'id_consumo',
                },
            },
            cantidad: {
                type: Sequelize.BIGINT
            },
            id_detalle: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            }
        },
        {
            timestamps: false,}
        );
    return Detalle;
};