'use strict';

var express = require('express');
var authController = require('./auth.controller');
var authService = require('./auth.service');

var router = express.Router();
router.use('/local', require('./local/index'));
router.use('/facebook', require('./facebook/index'));

router.post('/verify', authController.verify);
router.get('/logout', authService.isAuthenticated(), authController.logout);

router.post('/password/reset-request', authController.passwordResetRequest);
router.post('/password/reset', authController.passwordReset);

router.get('/verify-request/userId/:userId', authService.isAuthenticated(), authController.verifyRequest);
router.post('/session/salt', authService.isAuthenticated(), authController.getSessionSalt);

router.post('/email/update/userId/:userId', authService.isAuthenticated(), authController.emailUpdate);
router.post('/password/update/userId/:userId', authService.isAuthenticated(), authController.passwordUpdate);

module.exports = router;
