'use strict';

const bcrypt = require('bcrypt');
const config = require('src/util/config.js');

const AccountModel = require('src/models/account.model.js');

const hashPassword = (pwd) => {
  const numHashSaltRounds = Number(config.get('passwords:hash_salt_rounds'));
  return bcrypt.hash(password, numHashSaltRounds);
};
