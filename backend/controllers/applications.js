"use strict";

const Teacher = require("../model/Teacher");
const applicationsService = require("../service/applications.service");

module.exports = {
    /**
     * Get all applications of a student by its id
     *
     * @params: student_id
     * @body: none
     * @returns: { [ { proposal_id: number, title: string, description: string, application_date: date, status: string } ] }
     * @error 401 Unauthorized - if student_id is not the same as the authenticated user
     * @error 404 Not Found - if the student_id is not found
     * @error 500 Internal Server Error - if something went wrong
     *
     * The access to this is restricted to authenticated users only.
     * Check if user is authenticated is done by the middleware isLoggedIn.
     */
    getAllApplicationsByStudentId: (req, res) => {
        const student_id = req.params.student_id;

        // check if student_id is the same as the authenticated user
        if (student_id !== req.user.id)
            return res.status(401).json({ error: "You cannot get applications of another student" });

        applicationsService.getAllApplicationsByStudentId(student_id)
            .then((result) => {
                res.status(result.status).json(result.data);
            })
            .catch((err) => {
                res.status(err.status).json({ error: err.data });
            });
    },


    // TODO: commento
    getAllApplicationsByTeacherId: (req, res) => {
        applicationsService.getAllApplicationsByTeacherId(req.user)
            .then((result) => {
                res.status(result.status).json(result.data);
            })
            .catch((err) => {
                res.status(err.status).json({ error: err.data });
            });
    }
};