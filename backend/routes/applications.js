"use strict";

const express = require('express');
const router = express.Router();

const applicationsController = require('../controllers/applications');

/**
 * Applications API routes
 * All the routes for the applications resources
 */

/**
 * GET /api/applications/:student_id
 *
 * @params student_id
 * @body none
 * @returns
 * @error 401 Unauthorized - if the user is not authenticated or student_id is not the same as the authenticated user
 * @error 404 Not Found - if the student_id is not found
 * @error 500 Internal Server Error - if something went wrong
 */
router.get('/:student_id', applicationsController.getAllApplicationsByStudentId);

module.exports = router;