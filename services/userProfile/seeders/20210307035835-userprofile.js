'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            'userprofile',
            [
                {
                    id: '46fda6af-6c3b-435d-aa5e-07214f6e3eef',
                    uid: '12387asd',
                    firstName: 'Fukushima',
                    lastName: 'Kumida',
                    address: 'Telaga Mas',
                    about: 'Just wanna say hello',
                    job: 'Shopkeeper',
                    birthday: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {},
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('userprofile', null, {});
    },
};
