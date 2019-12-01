'use strict';
const Err = require('egads')
    .extend('Unexpected error occured', 500, 'InternalServerError');

Err.Account = Err.extend('Account Error', 403, 'AccountError');

module.exports = Err;
