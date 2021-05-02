'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            uid: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            displayName: {
                type: Sequelize.STRING(70),
                allowNull: false,
            },
            phoneNumber: {
                type: Sequelize.STRING(70),
                allowNull: false,
            },
            username: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            facebookId: {
                type: Sequelize.STRING(70),
                allowNull: true,
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
        await queryInterface.dropTable('users');
    },
};
