"use strict";

const Student = require("../model/Student");
const Teacher = require("../model/Teacher");
const Application = require("../model/Application");
const applicationsService = require("../service/applications.service");
const proposalsService = require("../service/proposals.service");

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


    /**
     * Get all applications of a teacher by their id
     *
     * @params: none
     * @body: none
     * @returns: {
     *   proposal_id: number,
     *   title: string,
     *   type: string,
     *   description: string,
     *   expiration_date: date,
     *   level: string,
     *   applications: [
     *     {
     *       application_id: number,
     *       status: string,
     *       application_date: date,
     *       student_id: number,
     *       surname: string,
     *       name: string,
     *       email: string,
     *       enrollment_year: number,
     *       cod_degree: string
     *     }
     *   ]
     * }
     * @error 401 Unauthorized - if teacher_id is not the same as the authenticated user
     * @error 404 Not Found - if the teacher_id is not found or no applications are found for their thesis proposals
     * @error 500 Internal Server Error - if something went wrong during the process
     *
     * The access to this is restricted to authenticated users only.
     * Check if the user is authenticated is done by the middleware isLoggedIn.
     */
    getAllApplicationsByTeacherId: (req, res) => {
        if (!(req.user instanceof Teacher)) {
            return res.status(401).json({ errors: ['Must be a teacher to make this request!'] });
        }

        applicationsService.getAllApplicationsByTeacherId(req.user.id)
            .then((result) => {
                res.status(result.status).json(result.data);
            })
            .catch((err) => {
                res.status(err.status).json({ errors: [err.data] });
            });
    },

    insertNewApplication: (req, res) => {
        if (req?.body && Object.keys(req.body).length !== 0) {
            applicationsService.insertNewApplication(req.body.proposal_id, req.user.id)
                .then((result) => {
                    res.status(200).json(result.data);
                })
                .catch((err) => {
                    res.status(500).json({ errors: [err.message] });
                });

        } else
            return res.status(400).send("Parameters not found in insert new application controller");

    },

    acceptOrRejectApplication: async (req, res) => {
        let status = req.body.status;
        let proposal_id = req.body.proposal_id;
        let student_id = req.body.student_id;
        let teacher_id = req.user.id;

        try {

            const applicationModified = await applicationsService.setApplicationStatusById(proposal_id, student_id, status, teacher_id);
            if (!applicationModified instanceof Application)
                res.status(400).json({ error: "Error in the parameters" });            
                //if status === "Accepted" -> al the other applications for the same proposal become "Canceled"
                //and the proposal become "Archived"
            if (status === "Accepted"){
                const canceledApplications = await applicationsService.setApplicationsStatusCanceledByProposalId(proposal_id, teacher_id);
                if (!canceledApplications instanceof Number)
                    return res.status(400).json({error: "Error in cancelling the proposals not accepted."});

                const archivedProposal = await proposalsService.setProposalArchived(proposal_id);

                console.log(archivedProposal);
                if (!(archivedProposal.proposal_id == proposal_id && archivedProposal.status == 'Archived'))
                    return res.status(400).json({error: "Error in setting the proposal as archived"});
            }

            return res.status(200).json({application: applicationModified});

        } catch (err) {
            console.error("[BACKEND-SERVER] Cannot insert set application's status", err)
            res.status(500).json({ error: "Internal server error" })
        }


    }
}