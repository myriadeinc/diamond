'use strict';
const _ = require('lodash');
const bcrypt = require('bcrypt');
const config = require('src/util/config.js');
const logger = require('src/util/logger.js').account;
const Err = require('src/util/error.js');
const AccountModel = require('src/models/account.model.js');

const hashPassword = (pwd) => {
  const numHashSaltRounds = Number(config.get('passwords:hash_salt_rounds'));
  return bcrypt.hash(password, numHashSaltRounds);
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
      hash: 'bcrypt',
    };
    const filteredData = _.pick(data, AccountsModel.validFields);
    return AccountsModel.create(filteredData);
  },

  getAccount: (accountId) => {
    return AccountModel.findOne({
      where: {
        externalId: accountId,
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
   * Validate a pair of password and email, if successful returns account
   *    otherwise returns empty object
   * @param {string} email
   * @param {string} password
   * @return {object}
   */
  validatePassword: async (email, password) => {
    const hashedPwd = await hashPassword(password);
    let account = await AccountModel.findOne({
      where: {
        email,
      },
    });
    let success = false;
    if (account.credential && 'bcrypt' === account.credential.hash) {
      if (account.credential.password === hashedPwd) {
        success = true;
      }
    }
    account = success ? account : {};
    return account.toJSON();
  },

};

module.exports = AccountServices;
