'use strict';
const testing = require('../test.init.js');

const argon2 = require('argon2');
const uuid = require('uuid/v4');

const AccountModel = require('src/models/account.model.js');

const hashPassword = (pwd) => {
    return argon2.hash(pwd);
};

let sampleUsers = [
    {
        name: "user0",
        externalId: uuid(),
        wallet_address: '0x1',
        email: 'user0@gmail.com',
        credential: {
            password: '',
            hash: 'argon2'
        }
    },
    {
        name: "user1",
        externalId: uuid(),
        wallet_address: '0x2',
        email: 'user1@gmail.com',
        credential: {
            password: '',
            hash: 'argon2'
        }
    },
    {
        name: "user2",
        externalId: uuid(),
        wallet_address: '0x3',
        email: 'user2@gmail.com',
        credential: {
            password: '',
            hash: 'argon2'
        }
    }
];


const clearAllAccounts = () => {
    return AccountModel.destroy({
        truncate: true,
        cascade: true
    });
}

const createSampleAccounts = () => {
    return Promise.all(sampleUsers.map(x => {
        return AccountModel.create(x);
    }))
}



const AccountHelpers = {
    sampleUsers,
    hashPassword,
    clearAllAccounts,
    createSampleAccounts
}

module.exports = AccountHelpers;