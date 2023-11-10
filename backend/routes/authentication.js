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
 * @returns { user: object }
 * @error 400 Bad Request - if username or password are not present
 * @error 401 Unauthorized - if username or password are not valid
 * @error 500 Internal Server Error - if something went wrong
 *
 * @see authenticationController.login
 */
router.post('/login', authenticationController.login);

/**
 * GET /api/authentication/current/user
 *
 * @params none
 * @body none
 * @returns { user: object }
 *
 * @see authenticationController.login
 */
router.get('/current/user', authenticationController.currentUser);


module.exports = router;