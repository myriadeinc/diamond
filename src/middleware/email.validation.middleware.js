'use strict';

const cache = require('src/util/cache.js');
const Err = require('src/util/error.js');

const EmailValidationMiddleware = {
  validateToken: async (req, res, next) => {
    const tok = req.body.email_token;

    const email = await cache.get(tok, 'Email::Confirmation')
    if (email){
      req.body.email = email;
      await cache.delete(tok, 'Email::Confirmation');
      next();
    }
    else {
      return res.status(403).send('Invalid email token');
    }  
  },
};

module.exports = EmailValidationMiddleware;
