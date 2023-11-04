"use strict";

const express = require('express');
const router = express.Router();

const proposalsController = require('../controllers/proposals');

/**
 * Proposals API routes
 * All the routes for the proposals resources
 *
 * Route /api/proposals
 */

/**
 * GET /api/proposals
 *
 * @params none
 * @body none
 * @returns { proposals: [ { id: number, title: string, description: string, author: string, ... } ] }
 * @error 401 Unauthorized - if the user is not logged in
 * @error 500 Internal Server Error - if something went wrong
 *
 * @see proposalsController.getProposals
 */
router.get('/', proposalsController.getAllProposals);

module.exports = router;

