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
            firstName: {
                type: Sequelize.STRING(70),
                allowNull: false,
            },
            lastName: {
                type: Sequelize.STRING(70),
                allowNull: false,
            },
            address: {
                type: Sequelize.STRING(),
                allowNull: false,
            },
            about: {
                type: Sequelize.TEXT(),
                allowNull: false,
            },
            job: {
                type: Sequelize.STRING(70),
                allowNull: false,
            },
            birthday: {
                type: Sequelize.DATE,
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
        await queryInterface.dropTable('userprofile');
    },
};
