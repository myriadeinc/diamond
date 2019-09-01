'use strict';

/*eslint-disable */
const router = require('express').Router();
/* eslint-enable */
const { check } = require('express-validator');

const AccountService = require('src/services/accounts.service.js');
const EmailVerificationMiddleware = require('src/middleware/email.validation.middleware.js');
const RequestValidationMiddleware = require('src/middleware/request.validation.middleware.js');


router.get(`/:accountId`, 
  (req, res) => {
    return AccountService.getAccount(req.params.accountId)
      .then((acc) => {
        res.status(200).send(acc.toJSON());
      })
      .catch((err) => {
        res.sendStatus(404);
      });
});

router.post('/', 
  [
    check('email_token').exists(),
    check('password').exists()
  ],
  RequestValidationMiddleware.handleErrors,
  EmailVerificationMiddleware.validateToken,
  (req, res, next) => {
    return AccountService.createAccount(req.body)
      .then((acc) => {
        res.status(200).send(acc);
      })
      .catch((err) => {
        res.sendStatus(500);
      });
});

router.put(`/:accountId`, (req, res) => {
  return AccountService.updateAccount(req.params.accountId, req.body)
      .then((acc) => {
        res.status(200).send(acc.toJSON());
      })
      .catch((err) => {
        res.sendStatus(500);
      });
});

router.delete(`/:accountId`, (req, res) => {
  return AccountService.deleteAccount(req.params.accountId)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        res.sendStatus(404);
      });
});


module.exports = router;
