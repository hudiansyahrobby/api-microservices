'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('userprofile', {
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
            address: {
                type: Sequelize.STRING(),
                allowNull: true,
            },
            about: {
                type: Sequelize.TEXT(),
                allowNull: true,
            },
            job: {
                type: Sequelize.STRING(70),
                allowNull: true,
            },
            birthday: {
                type: Sequelize.DATE,
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
        await queryInterface.dropTable('userprofile');
    },
};
