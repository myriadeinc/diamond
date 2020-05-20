"use strict";

/*eslint-disable */
const router = require("express").Router();
/* eslint-enable */
const { check } = require("express-validator");

const AccountService = require("src/services/accounts.service.js");
const EmailVerificationMiddleware = require("src/middleware/email.validation.middleware.js");
const RequestValidationMiddleware = require("src/middleware/request.validation.middleware.js");
const AuthMiddleware = require("src/middleware/auth.middleware.js");

const TokenService = require("src/services/token.service.js");

const Err = require("src/util/error.js");
const logger = require("src/util/logger.js");

router.post(
  "/create",
  [check("email_token").exists(), check("password").exists()],
  RequestValidationMiddleware.handleErrors,
  EmailVerificationMiddleware.validateToken,
  (req, res) => {
    return AccountService.createAccount(req.body)
      .then((acc) => {
        logger.account.info(`Account created for ${acc}`);
        res.status(200).send(acc);
      })
      .catch((err) => {
        if (err instanceof Err.Account) {
          logger.account.error(`Failed Account Creation ${req.body.email}`);
          logger.account.error(`  Reason: ${err.message}`);
          res.status(err.status).send(err.message);
        } else {
          res.sendStatus(500);
        }
      });
  }
);

router.post(
  "/resetPassword",
  [check("email_token").exists(), check("password").exists()],
  RequestValidationMiddleware.handleErrors,
  EmailVerificationMiddleware.validateToken,
  (req, res) => {
    return AccountService.resetPassword(req.body)
      .then((acc) => {
        logger.account.info(`Password Reset for ${acc}`);
        res.status(200).send(acc);
      })
      .catch((err) => {
        if (err instanceof Err.Account) {
          logger.account.error(`Failed Password Reset ${req.body.email}`);
          logger.account.error(`  Reason: ${err.message}`);
          res.status(err.status).send(err.message);
        } else {
          res.sendStatus(500);
        }
      });
  }
);

router.post(
  "/login",
  [check("email").exists().isEmail(), check("password").exists()],
  RequestValidationMiddleware.handleErrors,
  (req, res) => {
    return AccountService.validatePassword(req.body.email, req.body.password)
      .then((acc) => {
        return TokenService.createAccessToken(acc);
      })
      .then((tok) => {
        logger.account.info(`Successful login for ${req.body.email}`);
        res.status(200).send({
          accessToken: tok,
        });
      })
      .catch((err) => {
        if (err instanceof Err.Account) {
          logger.account.info(`Failed login for ${req.body.email}`);
          res.status(err.status).send(err.message);
        } else {
          console.log(err);
          res.status(500).send(err);
        }
      });
  }
);

router.post(
  "/address-login",
  [check("address").exists(), check("password").exists()],
  RequestValidationMiddleware.handleErrors,
  AuthMiddleware.authenticateSharedSecret,
  (req, res) => {
    return AccountService.validateStrantum(req.body.address, req.body.password)
      .then((acc) => {
        return TokenService.createAccessToken(acc);
      })
      .then((tok) => {
        logger.account.info(`Successful Strantum login for ${acc}`);
        res.status(200).send({
          accessToken: tok,
        });
      })
      .catch((err) => {
        if (err instanceof Err.Account) {
          logger.account.info(`Failed login for ${req.body.address}`);
          res.status(err.status).send(err.message);
        } else {
          res.status(500).send(err);
        }
      });
  }
);

router.get(`/:accountId`, AuthMiddleware.authenticateUser, (req, res) => {
  return AccountService.getAccount(req.accountId)
    .then((acc) => {
      res.status(200).send(acc.toJSON());
    })
    .catch((err) => {
      if (err instanceof Err.Account) {
        logger.account.info(`Failed fetching account for ${req.accountId}`);
        res.status(err.status).send(err.message);
      } else {
        res.status(500).send(err);
      }
    });
});

router.put(`/:accountId`, AuthMiddleware.authenticateUser, (req, res) => {
  return AccountService.updateAccount(req.accountId, req.body)
    .then((acc) => {
      res.status(200).send(acc.toJSON());
    })
    .catch((err) => {
      if (err instanceof Err.Account) {
        logger.account.info(`Failed updating account for ${req.accountId}`);
        res.status(err.status).send(err.message);
      } else {
        res.status(500).send(err);
      }
    });
});

router.delete(`/:accountId`, AuthMiddleware.authenticateUser, (req, res) => {
  return AccountService.deleteAccount(req.accountId)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      res.sendStatus(404);
    });
});

module.exports = router;
