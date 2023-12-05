"use strict";

const express = require("express");
const router = express.Router();

const authenticationController = require("../controllers/authentication");
const applicationsController = require("../controllers/applications");

/**
 * Applications API routes
 * All the routes for the applications resources
 */

/**
 * GET /api/applications/:student_id
 *
 * @params student_id
 * @body none
 * @returns: { [ { application_id: string, title: string, proposal_id: string, student_id: string, status: string, application_date: Date, supervisor_name: string, supervisor_surname: string } ] }
 * @error 401 Unauthorized - if the user is not authenticated or student_id is not the same as the authenticated user
 * @error 404 Not Found - if the student_id is not found
 * @error 500 Internal Server Error - if something went wrong
 */
router.get(
  "/:student_id",
  authenticationController.isLoggedIn,
  authenticationController.isStudent,
  applicationsController.getAllApplicationsByStudentId
);

/**
 * GET /api/applications/
 *
 * @params none
 * @body none
 * @returns {
 *  {
 *    proposal_id: number,
 *    title: string,
 *    description: string,
 *    application_date: date,
 *    status: string
 *  }[]
 * }
 */
router.get(
  "/",
  authenticationController.isLoggedIn,
  applicationsController.getAllApplicationsByTeacherId
);

router.post(
  "/",
  authenticationController.isLoggedIn,
  applicationsController.insertNewApplication
);

/**
 * PUT /api/applications/:application_id
 *
 * @params application_id
 * @body {status: string}
 *
 * @returns {Application}
 */
router.put(
  "/:application_id",
  authenticationController.isLoggedIn,
  authenticationController.isTeacher,
  applicationsController.acceptOrRejectApplication
);

/**
 * GET /api/applications/application/:application_id
 *
 */
router.get(
  "/application/:application_id",
  authenticationController.isLoggedIn,
  authenticationController.isTeacher,
  applicationsController.getApplicationById
);

module.exports = router;
