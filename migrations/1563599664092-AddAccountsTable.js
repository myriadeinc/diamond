'use strict';

const Migration = {

    up: (queryInterface, schema, Sequelize) => {
        return createAccountTable(queryInterface, schema, Sequelize);

    },
    
    down: (queryInterface, schema, Sequelize) => {
        return queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.dropTable({ tableName: 'Accounts', schema });
        });
    }
};

const createAccountTable = (queryInstance, schema, Sequelize) => {
    return queryInstance.createTable(
        'Accounts',
        {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            externalId: {
                type: Sequelize.UUID,
                unique: true,
                allowNull: false
            },
            balance: {
                type: Sequelize.BIGINT,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            email: {
                type: Sequelize.STRING
            },
            firstName: {
                type: Sequelize.TEXT
            },

            lastName: {
                type: Sequelize.TEXT
            },
            createdAt: { type: Sequelize.DATE },
            updatedAt: { type: Sequelize.DATE },
            deletedAt: { type: Sequelize.DATE }
        },{
            schema: schema
        }
    );
};

module.exports = Migration;
