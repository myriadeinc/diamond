'use strict';

/*eslint-disable */
const router = require('express').Router();
/* eslint-enable */

const AccountService = require('src/services/accounts.service.js');

// TO-DO: Need to add validation middleware

router.get(`/:accountId`, (req, res) => {
  return AccountService.getAccount(req.params.accountId)
      .then((acc) => {
        res.status(200).send(acc.toJSON());
      })
      .catch((err) => {
        res.sendStatus(404);
      });
});

router.post('/', (req, res) => {
  // NOTE THIS WILL NOT BE THE ACTUAL FLOW FOR ACCOUNT CREATION
  //  WILL NEED EMAIL VALIDATION FIRST...
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
