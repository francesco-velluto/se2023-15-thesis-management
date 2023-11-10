"use strict";

const applicationsService = require("../service/applications.service");

module.exports = {
    getAllApplicationsByStudentId: (req, res) => {
        // check if authenticated
        if (!req.isAuthenticated())
            return res.status(401).json({ error: "You must be authenticated to access this" });

        const student_id = req.params.student_id;

        // check if student_id is the same as the authenticated user
        if (student_id !== req.user.student_id)
            return res.status(401).json({ error: "You cannot get applications of another student" });

        applicationsService.getAllApplicationsByStudentId(student_id)
            .then((result) => {
                res.status(result.status).json(result.data);
            })
            .catch((err) => {
                res.status(err.status).json({error: err.data});
            });
    }
};