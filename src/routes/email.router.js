'use strict';

/*eslint-disable */
const router = require('express').Router();
/* eslint-enable */
const { check, validationResult } = require('express-validator');


const EmailVerificationService =
  require('src/services/email.verification.service.js');

router.post('/',
  [
    // username must be an email
    check('email').exists().isEmail(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const recipient = req.body.email;
    EmailVerificationService.verifyEmail(recipient)
      .then((valid) => {
        if (valid) {
          return res.status(200).send('Email Confirmation Sent');
        } else {
          return res.status(400).send(`Email ${recipient} is already in use`);
        }
      });
  });

router.post('/reset',
  [
    check('email').exists().isEmail(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const recipient = req.body.email;

    const resetStatus = EmailVerificationService.resetEmail(recipient);


    return res.status(200).send({
      resetStatus,
      message: "Reset Email Confirmation Sent"
    });

  });

module.exports = router;
