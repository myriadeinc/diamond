'use strict';
const _ = require('lodash');
const argon2 = require('argon2');
const config = require('src/util/config.js');
const logger = require('src/util/logger.js').account;
const Err = require('src/util/error.js');
const AccountModel = require('src/models/account.model.js');

const hashPassword = async (pwd) => {
  const p = await argon2.hash(pwd);
  return p;
};

const omittedFields = [
  'externalId',
  'id',
  'createdAt',
  'updatedAt',
];

const AccountServices = {

  // CRUD
  createAccount: async (data) => {
    if (!data.password) {
      logger.error('Failed to submit the password field');
      throw new Err.Account();
    }
    const hashedPassword = await hashPassword(data.password);
    delete data.password;
    data.credential = {
      password: hashedPassword,
      hash: 'argon2',
    };
    const filteredData = _.pick(data, AccountModel.validFields);
    let acc;
    try {
      acc = await AccountModel.create(filteredData);
    } catch (err) {
      logger.error(err);
      throw new Err.Account();
    }
    return acc.toJSON();
  },
  createAccountWithToken: async (data) => {
    let baseAccount = AccountServices.createAccount(data);
    const token = await TokenService.createAccessToken(acc);
    baseAccount.token = token
    return baseAccount;
  },

  getAccount: (accountId) => {
    return AccountModel.findOne({
      where: {
        externalId: accountId,
      },
    });
  },
  getAccountByEmail: (email) => {
    return AccountModel.findOne({
      where: {
        email,
      },
    });
  },

  updateAccount: (accountId, data) => {
    data = _.omit(data, omittedFields);
    return AccountModel.update(
      data,
      {
        where: {
          externalId: accountId,
        },
      }
    )
      .then(() => {
        return AccountServices.getAccount(accountId);
      })
      .catch((err) => {
        logger.error(err);
        throw new Err.Account();
      });
  },

  deleteAccount: (accountId) => {
    return AccountsModel.destroy({
      where: {
        externalId: accountId,
      },
    });
  },

  // Account Service Ops

  /**
   * Check if email already exists
   * @param {string} email
   * @return {boolean}
   */
  emailExists: async (email) => {
    const account = await AccountModel.findOne({
      where: {
        email: email,
      },
    });
    if (account) {
      return true;
    } else {
      return false;
    }
  },

  // New Passwords will always use argon2
  newPassword: async (accountId, newPass) => {
    let account = await AccountModel.findOne({
      where: {
        externalId: accountId
      },
    });

    const hashedPassword = await argon2.hash(newPass);
    const credential = {
      hash: 'argon2',
      password: hashedPassword
    }
    return account.update({ credential });


  },

  /**
   * Validate a pair of password and email, if successful returns account
   *    otherwise returns empty object
   * @param {string} email
   * @param {string} password
   * @return {object}
   */
  validatePassword: async (email, password) => {
    let account = await AccountModel.findOne({
      where: {
        email: email,
      },
    });
    let success = false;
    if (account && account.dataValues.credential) {
      if ('argon2' === account.dataValues.credential.hash) {
        success = await argon2.verify(account.dataValues.credential.password, password);
      }
    }
    if (!success) {
      throw new Err.Account('Failed Login');
    }
    return account.toJSON();
  },

  validateStrantum: async (address, password) => {
    let account = await AccountModel.findOne({
      where: {
        wallet_address: address,
      },
    });
    let success = false;
    if (account && account.dataValues.credential
      && 'argon2' === account.dataValues.credential.hash) {
      success = await argon2.verify(
        password,
        account.dataValues.credential.password);
    }
    account = success ? account.toJSON() : {};
    return account;
  },

};

module.exports = AccountServices;
