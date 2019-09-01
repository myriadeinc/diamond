'use strict';

const _ = require('lodash');
const config = require('src/util/config.js');

const encryption = require('src/util/encryption.js');

const EmailValidationMiddleware = {
    validateToken: (req, res, next) => {
        if (req.body.email){
            delete req.body.email;
        }
        let email = encryption.decrypt(req.body.email_token);
        req.body.email = email;
        next();
    }
}

module.exports = EmailValidationMiddleware;