'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('images', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            imageId: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            imageUrl: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            productId: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('images');
    },
};
