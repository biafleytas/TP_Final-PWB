module.exports = (sequelize, Sequelize) => {
    const Categoria = sequelize.define("Categoria", {
            nombre_categoria: {
                type: Sequelize.STRING
            },
            id_categoria: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            }
        },
        {
            timestamps: false,
        });
    return Categoria;
};