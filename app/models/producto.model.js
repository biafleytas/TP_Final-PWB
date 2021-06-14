module.exports = (sequelize, Sequelize) => {
    const Producto = sequelize.define("Producto", {
            nombre_producto: {
                type: Sequelize.STRING
            },
            id_categoria: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'Categoria',
                    key: 'id_categoria',
                },
            },
            precio: {
                type: Sequelize.BIGINT
            },
            id_producto: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            }
        },
        {
            timestamps: false,
        });
    return Producto;
};