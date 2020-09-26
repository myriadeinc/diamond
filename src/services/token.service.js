'use strict';

const _ = require('lodash');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const config = require('src/util/config.js');

const TokenService = {

  encodeAndSign: (data, options) => {
    return jwt.sign(data, config.get('jwt:private_key').trim(), _.extend({}, options, {
      algorithm: config.get('jwt:algorithm') || 'RS256',
      jwtid: uuid.v4(),
      issuer: config.get('service:name'),
    }));
  },

  decodeAndVerify: (token) => {
    return new Promise((resolve, reject) => {
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, config.get('jwt:public_key').trim());
      } catch (err) {
        return reject(err);
      }
      return resolve(_.omit(decodedToken, ['iat', 'jti']));
    });
  },

  createAccessToken: (account) => {
    // TODO: Fix error where dividing by 1000 to get unix in seconds does not actually give right value
    let expiry = Date.now() + 1000 * 60 * 60;
    //expiry = Math.floor(expiry / 1000);
    return TokenService.encodeAndSign({
      version: 1,
      account: {
        email: account.email,
        name: account.name,
        address: account.wallet_address,
      },

    }, {
      expiresIn: expiry,
      subject: account.id,
    });
  },
};

module.exports = TokenService;
