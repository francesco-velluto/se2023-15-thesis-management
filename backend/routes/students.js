"use strict";

const express = require("express");
const router = express.Router();
const { isLoggedIn, isTeacher } = require("../controllers/authentication");
const studentController = require("../controllers/students");

/**
 * GET /api/students/:student_id/career
 *
 * Retrieve the career of a student given his id
 * Authentication: Required
 * Authorization required: Teacher
 *
 * @param {Object} res HTTP Response Object
 * response body contains an array of degrees
 *
 * @error 401 - Not Authenticated, Not Authorized
 * @error 404 - Student not found
 * @error 500 - Internal Server Error
 *
 */
router.get(
  "/:student_id/career",
  isLoggedIn,
  isTeacher,
  studentController.getStudentCareer
);

/**
 * GET /api/students/:student_id
 *
 * Retrieve the lstudent given his id
 * Authentication: Required
 * Authorization required: Teacher
 *
 * @param {Object} res HTTP Response Object
 * response body contains an array of degrees
 *
 * @error 401 - Not Authenticated, Not Authorized
 * @error 404 - Student not found
 * @error 500 - Internal Server Error
 *
 */
router.get(
  "/:student_id",
  isLoggedIn,
  isTeacher,
  studentController.getStudentById
);

module.exports = router;
