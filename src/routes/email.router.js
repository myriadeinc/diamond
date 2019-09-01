'use strict';

/*eslint-disable */
const router = require('express').Router();
/* eslint-enable */

const EmailVerificationService = require('src/services/email.verification.service.js');

router.post('/', (req, res, next) => {
    const recipient = req.body.email;
    
})

module.exports = router;