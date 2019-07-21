'use strict';

const Migration = {

    up: (queryInterface, schema, Sequelize) => {
        return queryInterface.sequelize.transaction((transaction) => {
            return addColumnToAccountTable('credential', Sequelize.JSONB, queryInterface, schema, Sequelize, transaction);
        })
    },

    down: (queryInterface, schema, Sequelize) => {
        return queryInterface.sequelize.transaction((transaction) => {
            return queryInterface.removeColumn({ tableName: 'Accounts', schema }, 'credential', { schema, transaction });
        });
    }
};

const addColumnToAccountTable = (columnName, columnType, queryInterface, schema, Sequelize, transaction) => {
    return queryInterface.addColumn(
        { tableName: 'Accounts', schema },
        columnName,
        { type: columnType },
        { transaction, schema }
    );
};

module.exports = Migration;
