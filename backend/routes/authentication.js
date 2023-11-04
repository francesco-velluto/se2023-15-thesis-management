"use strict";

const express = require('express');
const router = express.Router();

const authenticationController = require('../controllers/authentication');

/**
 * Authentication API routes
 * All the routes for the authentication
 */

/**
 * POST /api/authentication/login
 *
 * @params none
 * @body { username: string, password: string }
 * @returns { token: string }
 * @error 400 Bad Request - if username or password are not present
 * @error 401 Unauthorized - if username or password are not valid
 * @error 500 Internal Server Error - if something went wrong
 *
 * @see authenticationController.login
 */
router.post('/login', authenticationController.login);

module.exports = router;