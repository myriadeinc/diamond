'use strict';

const testing = require('../test.init.js');

const AccountService = require('src/services/accounts.service.js');
const AccountHelpers = require('test/helpers/account.helpers.js');

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-string'))
    .should();

describe('Account Service Unit tests', () => {

    before('Await DB', () => {
        return testing.dbReady;
    });
    before('compute password for dummy users', async () => {
        AccountHelpers.sampleUsers = await Promise.all(AccountHelpers.sampleUsers.map(async (usr) => {
            usr.credential.password = await AccountHelpers.hashPassword(usr.name);
            return usr;
        }));
    });

    before('Setting up some dummy accounts', async () => {
        await AccountHelpers.clearAllAccounts();
        await AccountHelpers.createSampleAccounts(); 
    }) ;

    after('Cleanup', () => {
        return AccountHelpers.clearAllAccounts();
    })

    

    it('Should fetch an user', async() => {
        const usr = await AccountService.getAccount(
            AccountHelpers.sampleUsers[0].externalId
        );
        usr.should.not.be.null;
        usr.name.should.equal(AccountHelpers.sampleUsers[0].name);
    });

    it('Should validate an user password', async () => {
        const usr = AccountHelpers.sampleUsers[0];
        // since here are using our name as password
        const res = await AccountService.validatePassword(usr.email, usr.name);
        res.should.not.be.null;
        res.name.should.equal(usr.name);
        res.email.should.equal(usr.email);
        res.id.should.equal(usr.externalId);
    });

    it('Should create an account', async () => {
        const data = {
            name: 'usr3',
            email: 'usr3@gmail.com',
            password: 'usr3',
            wallet_address: '0x4',
        };
        const res = await AccountService.createAccount(data);
        res.should.not.be.null;
        res.name.should.equal(data.name);
        res.email.should.equal(data.email);
    });

    // it('Should delete an account', async () => {

    // })

})