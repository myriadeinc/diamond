'use strict';
/*eslint-disable */
const router = require('express').Router();
/* eslint-enable */

router.use('/account', require('src/routes/account.router.js'));

module.exports = router;
