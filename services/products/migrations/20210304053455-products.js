'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('products', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            name: {
                type: Sequelize.STRING(70),
                allowNull: false,
            },
            rating: {
                type: Sequelize.INTEGER(),
                allowNull: false,
                defaultValue: 0,
            },
            quantity: {
                type: Sequelize.INTEGER(),
                allowNull: false,
            },
            price: {
                type: Sequelize.INTEGER(),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT(1500),
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('products');
    },
};
