'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            'categories',
            [
                {
                    id: '46fda6af-6c3b-435d-aa5e-07214f6e3eef',
                    name: 'smartphone',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: '96b46303-46ee-4c94-b774-eaabbf14777e',
                    name: 'laptop',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {},
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('categories', null, {});
    },
};
